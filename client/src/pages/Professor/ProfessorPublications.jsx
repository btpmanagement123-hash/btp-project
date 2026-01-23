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
  title: { fontSize: 20, fontWeight: 600, marginBottom: 12 },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
    gap: 10
  },
  input: {
    padding: '8px 10px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    fontSize: 13
  },
  btn: {
    gridColumn: '1 / -1',
    marginTop: 4,
    padding: '9px 0',
    borderRadius: 10,
    border: 'none',
    background: '#4f46e5',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  },
  error: { gridColumn: '1 / -1', fontSize: 13, color: '#dc2626' },
  pubCard: {
    marginTop: 10,
    background: '#fff',
    borderRadius: 14,
    padding: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
  },
  pubTitle: { fontSize: 14, fontWeight: 600 },
  pubMeta: { fontSize: 12, color: '#6b7280' },
  deleteBtn: {
    padding: '6px 12px',
    borderRadius: 999,
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    fontSize: 12,
    cursor: 'pointer'
  },
  empty: { fontSize: 13, color: '#6b7280', marginTop: 8 }
};

export default ProfessorPublications;
