import { useEffect, useRef, useState } from 'react';
import api from '../../api/axios';

// ─── Helpers ────────────────────────────────────────────────────────────────
const extractIntro = (text) => {
  const idx = text.indexOf('###');
  if (idx === -1) return text.trim();
  return text.slice(0, idx).trim() || null;
};

const extractRawProjects = (text) => {
  const blocks = text.split('---').filter((b) => b.includes('###'));
  return blocks.map((block) => {
    const titleMatch = block.match(/###\s+(?:🔬\s+)?Project\s+\d+:\s+(.+)/i);
    const descMatch  = block.match(/\*\*Description:\*\*\s+([\s\S]+?)(?=\*\*Supervisor|$)/i);
    const supMatch   = block.match(/\*\*(?:Best\s+)?Supervisor:\*\*\s+([^—\n]+)/i);
    return {
      title: titleMatch?.[1]?.trim() || 'Project',
      description: descMatch?.[1]?.trim() || '',
      suggestedProfessors: supMatch ? [supMatch[1].trim()] : [],
    };
  }).filter((p) => p.title !== 'Project' || p.description);
};

// ─── Component ────────────────────────────────────────────────────────────────

const ProjectAdvisorChat = () => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const QUICK_PROMPTS = [
    '💡 IoT and embedded systems',
    '📡 5G or wireless communication',
    '🧠 AI or deep learning',
    '🔬 VLSI and low power circuits',
    '📷 Computer vision',
    '🔭 Optical communication',
  ];

  const initSession = async () => {
    try {
      const res = await api.post('/student/chat/session');
      setSessionId(res.data.data.sessionId);
      setError('');
    } catch (err) {
      setError('Failed to start a session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { initSession(); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sendLoading]);

  const sendMessage = async (text) => {
    const trimmed = (text || question).trim();
    if (!trimmed || !sessionId || sendLoading) return;

    const userMsg = { role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setSendLoading(true);

    try {
      const res = await api.post(`/student/chat/${sessionId}/message`, { question: trimmed });
      const { answer, projects } = res.data.data;
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: answer,
        projects,
        timestamp: new Date(),
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, { 
        role: 'error', 
        content: 'Failed to get a response.', 
        timestamp: new Date() 
      }]);
    } finally {
      setSendLoading(false);
    }
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.smallMuted}>Starting advisor session...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Project Advisor</h2>
      <p style={styles.smallMuted}>
        Tell me your interests — I'll suggest projects and match you with professors.
      </p>

      <div style={styles.chatWindow}>
        {messages.length === 0 && (
          <div style={styles.welcomeState}>
            <div style={styles.welcomeIcon}>💬</div>
            <p style={styles.welcomeText}>What topics are you interested in?</p>
            <div style={styles.quickPrompts}>
              {QUICK_PROMPTS.map((p) => (
                <button key={p} style={styles.quickBtn} onClick={() => sendMessage(p)} disabled={sendLoading}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={styles.messageRow(msg.role)}>
            {msg.role !== 'user' && <div style={styles.avatar('bot')}>🤖</div>}
            
            <div style={styles.bubbleWrapper(msg.role)}>
              {msg.role === 'error' ? (
                <div style={styles.errorBubble}>{msg.content}</div>
              ) : (
                msg.role === 'assistant' ? (
                  extractIntro(msg.content) && (
                    <div style={styles.bubble('assistant')}>{extractIntro(msg.content)}</div>
                  )
                ) : (
                  <div style={styles.bubble('user')}>{msg.content}</div>
                )
              )}

              {msg.role === 'assistant' && (() => {
                const cards = (msg.projects?.length > 0) ? msg.projects : extractRawProjects(msg.content);
                return cards.map((proj, j) => (
                  <div key={j} style={styles.projectCard}>
                    <div style={styles.cardHeader}>
                      <span style={styles.cardStatusBadge}>PROJECT IDEA</span>
                      <h3 style={styles.cardTitle}>{proj.title}</h3>
                    </div>
                    <p style={styles.cardDesc}>{proj.description}</p>
                    {proj.suggestedProfessors?.length > 0 && (
                      <div style={styles.profsRow}>
                        <span style={styles.profsLabel}>Suggested Supervisor</span>
                        <div style={styles.profChips}>
                          {proj.suggestedProfessors.map((name) => (
                            <div key={name} style={styles.teamChip}>
                              <span style={styles.initial}>{name.charAt(0)}</span>
                              <span style={styles.chipName}>{name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ));
              })()}
              <span style={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {msg.role === 'user' && <div style={styles.avatar('user')}>👤</div>}
          </div>
        ))}
        {sendLoading && (
          <div style={styles.messageRow('bot')}>
            <div style={styles.avatar('bot')}>🤖</div>
            <div style={styles.typingBubble}>...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputArea}>
        <textarea
          style={styles.textarea}
          placeholder="Ask about project ideas..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
          rows={1}
        />
        <button 
          style={{ ...styles.sendBtn, opacity: sendLoading || !question.trim() ? 0.5 : 1 }}
          onClick={() => sendMessage()}
          disabled={sendLoading || !question.trim()}
        >
          {sendLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', maxWidth: '100%' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f1f5f9', borderTop: '4px solid #4f46e5', borderRadius: '50%' },
  
  title: { fontSize: 'clamp(1.25rem, 5vw, 1.625rem)', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' },
  smallMuted: { fontSize: '0.875rem', color: '#64748b', fontWeight: '500', marginBottom: '1.5rem', display: 'block' },

  chatWindow: {
    background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '1.5rem',
    padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column',
    gap: '1.5rem', minHeight: '400px', maxHeight: '60vh', marginBottom: '1.5rem',
  },

  messageRow: (role) => ({
    display: 'flex', justifyContent: role === 'user' ? 'flex-end' : 'flex-start', gap: '12px',
  }),
  avatar: (type) => ({
    width: '36px', height: '36px', borderRadius: '10px',
    background: type === 'user' ? '#e0e7ff' : '#4f46e5',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0,
  }),
  bubbleWrapper: (role) => ({
    display: 'flex', flexDirection: 'column', alignItems: role === 'user' ? 'flex-end' : 'flex-start',
    maxWidth: '85%', gap: '8px',
  }),
  bubble: (role) => ({
    padding: '12px 16px', borderRadius: '1rem',
    background: role === 'user' ? '#4f46e5' : '#ffffff',
    color: role === 'user' ? '#ffffff' : '#1e293b',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '0.95rem', lineHeight: '1.5',
  }),

  // Unified Card Styling
  projectCard: {
    background: '#ffffff', borderRadius: '1.5rem', padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9', width: '100%',
  },
  cardHeader: { marginBottom: '1rem' },
  cardStatusBadge: {
    padding: '0.375rem 0.875rem', borderRadius: '8px', fontSize: '0.7rem',
    fontWeight: '700', textTransform: 'uppercase', background: '#f0f7ff', color: '#4f46e5',
    display: 'inline-block', marginBottom: '0.5rem',
  },
  cardTitle: { fontSize: '1.125rem', fontWeight: '800', color: '#1e293b', margin: 0 },
  cardDesc: { fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1rem' },
  
  profsRow: { borderTop: '1px solid #f1f5f9', paddingTop: '1rem' },
  profsLabel: { fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' },
  profChips: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' },
  teamChip: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #f1f5f9' },
  initial: { width: '24px', height: '24px', borderRadius: '6px', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.75rem' },
  chipName: { fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' },

  inputArea: {
    display: 'flex', gap: '12px', alignItems: 'center', padding: '1rem',
    background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
  },
  textarea: { flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', resize: 'none', background: 'transparent' },
  sendBtn: {
    background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px',
    borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
  },
  timestamp: { fontSize: '0.7rem', color: '#94a3b8' },
  welcomeState: { textAlign: 'center', padding: '2rem' },
  quickPrompts: { display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '1rem' },
  quickBtn: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 14px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' },
};

export default ProjectAdvisorChat;