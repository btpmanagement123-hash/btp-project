// client/src/pages/Professor/ProfessorPublications.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ProfessorPublications = () => {
  const [publications, setPublications] = useState([]);
  const [form, setForm] = useState({
    doi: '',
    title: '',
    journal: '',
    year: '',
    authors: '',
    link: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadPubs = async () => {
    const res = await api.get('/professor/publications');
    setPublications(res.data);
  };

  useEffect(() => {
    loadPubs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/professor/publications', {
        ...form,
        year: form.year ? Number(form.year) : undefined
      });
      setForm({
        doi: '',
        title: '',
        journal: '',
        year: '',
        authors: '',
        link: ''
      });
      await loadPubs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add publication');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this publication?')) return;
    await api.delete(`/professor/publications/${id}`);
    await loadPubs();
  };

  return (
    <div>
      <h2 style={styles.title}>Publications</h2>

      <form onSubmit={handleAdd} style={styles.form}>
        <input
          name="doi"
          placeholder="DOI *"
          value={form.doi}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          name="title"
          placeholder="Title *"
          value={form.title}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          name="journal"
          placeholder="Journal / Conference"
          value={form.journal}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="authors"
          placeholder="Authors (comma-separated)"
          value={form.authors}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="link"
          placeholder="Link (optional)"
          value={form.link}
          onChange={handleChange}
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.btn} disabled={saving}>
          {saving ? 'Saving...' : 'Add Publication'}
        </button>
      </form>

      <div style={{ marginTop: 16 }}>
        {publications.map((p) => (
          <div key={p._id} style={styles.pubCard}>
            <div>
              <p style={styles.pubTitle}>{p.title}</p>
              <p style={styles.pubMeta}>
                {p.authors && `${p.authors} · `}
                {p.journal}
                {p.year && ` · ${p.year}`}
              </p>
              <p style={styles.pubMeta}>DOI: {p.doi}</p>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12 }}
                >
                  View
                </a>
              )}
            </div>
            <button style={styles.deleteBtn} onClick={() => handleDelete(p._id)}>
              Remove
            </button>
          </div>
        ))}
        {publications.length === 0 && (
          <p style={styles.empty}>No publications added yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  title: { 
    fontSize: '26px', 
    fontWeight: '800', 
    color: '#0f172a', 
    letterSpacing: '-0.025em',
    marginBottom: '20px' 
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', // Responsive grid
    gap: '16px',
    background: '#ffffff',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  input: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  btn: {
    gridColumn: '1 / -1',
    marginTop: '8px',
    padding: '14px 0',
    borderRadius: '12px',
    border: 'none',
    background: '#4f46e5',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'transform 0.1s ease, background 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
  },
  error: { 
    gridColumn: '1 / -1', 
    fontSize: '13px', 
    color: '#dc2626',
    background: '#fef2f2',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  pubCard: {
    marginTop: '16px',
    background: '#ffffff',
    borderRadius: '18px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    transition: 'all 0.2s ease'
  },
  pubTitle: { 
    fontSize: '16px', 
    fontWeight: '700', 
    color: '#1e293b',
    marginBottom: '6px',
    lineHeight: '1.4'
  },
  pubMeta: { 
    fontSize: '13px', 
    color: '#64748b',
    lineHeight: '1.6'
  },
  deleteBtn: {
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1px solid #fee2e2',
    background: '#fff1f2',
    color: '#be123c',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginLeft: '16px'
  },
  empty: { 
    fontSize: '14px', 
    color: '#94a3b8', 
    textAlign: 'center',
    marginTop: '40px',
    fontStyle: 'italic'
  }
};

export default ProfessorPublications;
