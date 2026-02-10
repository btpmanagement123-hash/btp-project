// client/src/pages/Student/StudentProjectRegistration.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const StudentProjectRegistration = () => {
  const [me, setMe] = useState(null);
  const [profs, setProfs] = useState([]);
  const [selectedProf, setSelectedProf] = useState('');
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState([]);
  const [maxGroupSize, setMaxGroupSize] = useState(3);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [canRegister, setCanRegister] = useState(true);
  const [registrationBlockReason, setRegistrationBlockReason] = useState('');
  const [existingRequests, setExistingRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, cfgRes, profRes, requestsRes] = await Promise.all([
          api.get('/student/me'),
          api.get('/student/btp-config'),
          api.get('/student/available-professors'),
          api.get('/student/group-requests')
        ]);
        
        setMe(meRes.data);
        setMaxGroupSize(cfgRes.data?.maxGroupSize || 3);
        setProfs(profRes.data || []);
        
        const requests = requestsRes.data || [];
        setExistingRequests(requests);
        
        // Check if student can register
        const blockStatus = checkRegistrationEligibility(meRes.data._id, requests);
        setCanRegister(blockStatus.canRegister);
        setRegistrationBlockReason(blockStatus.reason);
        
      } catch (err) {
        console.error('student reg init error', err);
        setError('Could not load registration data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const checkRegistrationEligibility = (userId, requests) => {
    if (!requests || requests.length === 0) {
      return { canRegister: true, reason: '' };
    }

    const userIdStr = String(userId);

    // Check if student created an active request
    const createdActiveRequest = requests.find(
      (req) => String(req.leader?._id) === userIdStr && req.status !== 'rejected'
    );

    if (createdActiveRequest) {
      return {
        canRegister: false,
        reason: `You have already created a group request (${createdActiveRequest.status.replace('_', ' ')}). Wait for responses or until it is rejected.`
      };
    }

    // Check if student has pending invitations
    const pendingInvitations = requests.filter((req) => {
      if (String(req.leader?._id) === userIdStr) return false;
      
      const memberStatus = req.members?.find(
        (m) => String(m.student?._id) === userIdStr
      );
      
      return memberStatus && memberStatus.status === 'pending';
    });

    if (pendingInvitations.length > 0) {
      return {
        canRegister: false,
        reason: `You have ${pendingInvitations.length} pending invitation(s). Please respond to them before creating a new request.`
      };
    }

    // Check if student has accepted an active request
    const acceptedActiveRequest = requests.find((req) => {
      const memberStatus = req.members?.find(
        (m) => String(m.student?._id) === userIdStr
      );
      
      return (
        memberStatus && 
        memberStatus.status === 'accepted' && 
        req.status !== 'rejected'
      );
    });

    if (acceptedActiveRequest) {
      return {
        canRegister: false,
        reason: `You have already accepted a group request (${acceptedActiveRequest.status.replace('_', ' ')}). Wait for final approval or until it is rejected.`
      };
    }

    return { canRegister: true, reason: '' };
  };

  useEffect(() => {
    if (me) {
      setMembers([
        {
          name: me.name,
          roll: me.userId || '',
          isSelf: true
        }
      ]);
    }
  }, [me]);

  const addMember = () => {
    if (members.length >= maxGroupSize) return;
    setMembers([...members, { name: '', roll: '', isSelf: false }]);
  };

  const removeMember = (idx) => {
    if (members[idx].isSelf) return; // Can't remove self
    setMembers(members.filter((_, i) => i !== idx));
  };

  const updateMember = (idx, field, value) => {
    const copy = [...members];
    copy[idx][field] = value;
    setMembers(copy);
  };

  const remainingSlots = maxGroupSize - members.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    // Validate form
    if (!selectedProf) {
      setError('Please select a supervisor');
      setSaving(false);
      return;
    }

    if (!title.trim()) {
      setError('Please enter a project title');
      setSaving(false);
      return;
    }

    // Validate all members have data
    for (let i = 0; i < members.length; i++) {
      if (!members[i].name.trim() || !members[i].roll.trim()) {
        setError(`Please fill in all member details (Member ${i + 1})`);
        setSaving(false);
        return;
      }
    }

    try {
      const payload = {
        professorId: selectedProf,
        title: title.trim(),
        members: members.map((m) => ({
          name: m.name.trim(),
          roll: m.roll.trim()
        }))
      };

      const res = await api.post('/student/group-requests', payload);
      setMsg('✓ Group request submitted successfully! Ask your teammates to accept the invitation.');
      console.log('group-request created', res.data);
      
      // Reset form
      setTitle('');
      setSelectedProf('');
      setMembers([{
        name: me.name,
        roll: me.userId || '',
        isSelf: true
      }]);
      
      // Reload to update eligibility
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not register group. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading registration form...</p>
    </div>
  );
  
  if (!me) return (
    <div style={styles.errorContainer}>
      <p style={styles.errorText}>{error || 'Could not load profile.'}</p>
    </div>
  );

  // Show registration blocked message
  if (!canRegister) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>BTP Group Registration</h2>
        
        <div style={styles.blockCard}>
          <div style={styles.blockIcon}>⚠️</div>
          <h3 style={styles.blockTitle}>Registration Currently Unavailable</h3>
          <p style={styles.blockReason}>{registrationBlockReason}</p>
          
          {existingRequests.length > 0 && (
            <div style={styles.requestsSummary}>
              <h4 style={styles.summaryTitle}>Your Current Requests:</h4>
              {existingRequests.map((req) => {
                const userIdStr = String(me._id);
                const isLeader = String(req.leader?._id) === userIdStr;
                const memberStatus = req.members?.find(
                  (m) => String(m.student?._id) === userIdStr
                )?.status;

                return (
                  <div key={req._id} style={styles.requestCard}>
                    <div style={styles.requestHeader}>
                      <span style={styles.requestTitle}>
                        {req.title || 'Untitled Project'}
                      </span>
                      <span style={styles.statusBadge(req.status)}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div style={styles.requestMeta}>
                      <span style={styles.metaItem}>
                        {isLeader ? '👑 You are the leader' : `📩 ${memberStatus || 'Member'}`}
                      </span>
                      <span style={styles.metaItem}>
                        👥 {req.members?.length || 0} members
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div style={styles.actionHint}>
            <p style={styles.hintText}>
              💡 <strong>What to do next:</strong>
            </p>
            <ul style={styles.hintList}>
              <li>Check the "Group Invitations" tab to respond to pending requests</li>
              <li>Wait for your current request to be approved or rejected</li>
              <li>Contact your teammates or supervisor if needed</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>BTP Group Registration</h2>

      {/* Submitting member profile */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Your Profile (Submitting Member)</h3>
        <div style={styles.row}>
          <span style={styles.label}>Name</span>
          <span style={styles.value}>{me.name}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Roll Number</span>
          <span style={styles.value}>{me.userId || '-'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Email</span>
          <span style={styles.value}>{me.email}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
        {/* Group members */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              Group Members ({members.length}/{maxGroupSize})
            </h3>
            <span style={styles.smallMuted}>
              You + up to {maxGroupSize - 1} more members
            </span>
          </div>

          {members.map((m, idx) => (
            <div key={idx} style={styles.memberRow}>
              <div style={{ flex: 1 }}>
                <label style={styles.fieldLabel}>
                  Member {idx + 1} Name {m.isSelf && '(You)'}
                </label>
                <input
                  type="text"
                  value={m.name}
                  disabled={m.isSelf}
                  onChange={(e) => updateMember(idx, 'name', e.target.value)}
                  style={{
                    ...styles.input,
                    backgroundColor: m.isSelf ? '#f8fafc' : '#ffffff'
                  }}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.fieldLabel}>Roll Number</label>
                <input
                  type="text"
                  value={m.roll}
                  disabled={m.isSelf}
                  onChange={(e) => updateMember(idx, 'roll', e.target.value)}
                  style={{
                    ...styles.input,
                    backgroundColor: m.isSelf ? '#f8fafc' : '#ffffff'
                  }}
                  required
                />
              </div>
              {!m.isSelf && (
                <button
                  type="button"
                  onClick={() => removeMember(idx)}
                  style={styles.removeBtn}
                  title="Remove member"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {remainingSlots > 0 && (
            <button
              type="button"
              onClick={addMember}
              style={styles.addBtn}
            >
              + Add Group Member ({remainingSlots} slot(s) remaining)
            </button>
          )}
        </div>

        {/* Supervisor selection + title */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Supervisor & Project</h3>

          <label style={styles.fieldLabel}>
            Preferred Supervisor <span style={styles.required}>*</span>
          </label>
          <select
            value={selectedProf}
            onChange={(e) => setSelectedProf(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">Select supervisor</option>
            {profs.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} · {p.department}
              </option>
            ))}
          </select>

          <label style={styles.fieldLabel}>
            Project Title <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            placeholder="e.g., AI-driven BTP Workflow Management System"
            required
          />
        </div>

        {error && (
          <div style={styles.error}>
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}
        
        {msg && (
          <div style={styles.success}>
            {msg}
          </div>
        )}

        <button 
          type="submit" 
          disabled={saving} 
          style={{
            ...styles.submitBtn,
            opacity: saving ? 0.7 : 1,
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'Submitting Request...' : 'Submit Group Registration'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '100%'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f1f5f9',
    borderTop: '4px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  errorContainer: {
    padding: '20px',
    background: '#fef2f2',
    borderRadius: '12px',
    border: '1px solid #fecaca'
  },
  errorText: {
    fontSize: '14px',
    color: '#dc2626',
    margin: 0
  },
  title: { 
    fontSize: 'clamp(1.25rem, 5vw, 1.625rem)', 
    fontWeight: '800', 
    marginBottom: '1.5rem', 
    color: '#0f172a',
    letterSpacing: '-0.025em'
  },
  blockCard: {
    background: '#fffbeb',
    border: '2px solid #fcd34d',
    borderRadius: '20px',
    padding: 'clamp(1.5rem, 5vw, 2.5rem)',
    textAlign: 'center'
  },
  blockIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  blockTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#92400e',
    marginBottom: '12px'
  },
  blockReason: {
    fontSize: '15px',
    color: '#78350f',
    marginBottom: '24px',
    lineHeight: '1.6'
  },
  requestsSummary: {
    marginTop: '24px',
    padding: '20px',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #fde68a',
    textAlign: 'left'
  },
  summaryTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#78350f',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  requestCard: {
    padding: '12px',
    background: '#fefce8',
    borderRadius: '10px',
    marginBottom: '8px',
    border: '1px solid #fef3c7'
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    flexWrap: 'wrap'
  },
  requestTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b'
  },
  statusBadge: (status) => ({
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    background: status === 'approved' ? '#d1fae5' : status === 'rejected' ? '#fee2e2' : '#dbeafe',
    color: status === 'approved' ? '#065f46' : status === 'rejected' ? '#991b1b' : '#1e40af'
  }),
  requestMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#64748b',
    flexWrap: 'wrap'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  actionHint: {
    marginTop: '24px',
    padding: '16px',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #fde68a',
    textAlign: 'left'
  },
  hintText: {
    fontSize: '14px',
    color: '#78350f',
    marginBottom: '8px'
  },
  hintList: {
    margin: '8px 0 0 20px',
    fontSize: '13px',
    color: '#92400e',
    lineHeight: '1.8'
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    marginBottom: '1.25rem',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03)',
    boxSizing: 'border-box'
  },
  cardTitle: { 
    fontSize: '1rem', 
    fontWeight: '700', 
    marginBottom: '1rem', 
    color: '#334155',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #f8fafc'
  },
  smallMuted: { 
    fontSize: '0.75rem', 
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '4px 10px',
    borderRadius: '6px',
    whiteSpace: 'nowrap'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.875rem',
    padding: '0.625rem 0',
    borderBottom: '1px solid #f8fafc'
  },
  label: { 
    color: '#94a3b8', 
    fontWeight: '500',
    flexShrink: 0 
  },
  value: { 
    color: '#1e293b', 
    fontWeight: '600',
    textAlign: 'right',
    wordBreak: 'break-word'
  },
  memberRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '1rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #eff6ff',
    position: 'relative'
  },
  fieldLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    display: 'block'
  },
  required: {
    color: '#ef4444'
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box'
  },
  removeBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    background: '#fff',
    color: '#dc2626',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  addBtn: {
    marginTop: '0.5rem',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '2px dashed #cbd5e1',
    background: 'transparent',
    color: '#6366f1',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
  },
  error: { 
    fontSize: '0.875rem', 
    color: '#ef4444', 
    backgroundColor: '#fef2f2', 
    padding: '0.75rem', 
    borderRadius: '10px',
    borderLeft: '4px solid #ef4444',
    marginBottom: '1rem'
  },
  success: { 
    fontSize: '0.875rem', 
    color: '#10b981', 
    backgroundColor: '#f0fdf4', 
    padding: '0.75rem', 
    borderRadius: '10px', 
    borderLeft: '4px solid #10b981',
    marginBottom: '1rem'
  },
  submitBtn: {
    marginTop: '0.75rem',
    padding: '14px 28px',
    borderRadius: '12px',
    border: 'none',
    background: '#4f46e5',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)',
    width: '100%',
    boxSizing: 'border-box'
  }
};

export default StudentProjectRegistration;