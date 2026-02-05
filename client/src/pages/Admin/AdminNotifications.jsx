// import { useState } from 'react';
// import api from '../../api/axios';

// const AdminNotifications = () => {
//   const [audience, setAudience] = useState('all');
//   const [session, setSession] = useState('');
//   const [title, setTitle] = useState('');
//   const [message, setMessage] = useState('');
//   const [validTill, setValidTill] = useState('');
//   const [info, setInfo] = useState('');

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setInfo('');
//     try {
//       await api.post('/admin/notifications', {
//         audience,
//         session: session || null,
//         title,
//         message,
//         validTill: validTill || null
//       });
//       setInfo('Notification created');
//       setTitle('');
//       setMessage('');
//       setValidTill('');
//     } catch (err) {
//       setInfo(err.response?.data?.message || 'Failed to create notification');
//     }
//   };

//   return (
//     <div style={styles.wrapper}>
//       <h2 style={styles.title}>Create Notification</h2>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <div style={styles.row}>
//           <div style={styles.col}>
//             <label style={styles.label}>Audience</label>
//             <select
//               value={audience}
//               onChange={e => setAudience(e.target.value)}
//               style={styles.input}
//             >
//               <option value="all">All</option>
//               <option value="students">Students</option>
//               <option value="faculty">Faculty</option>
//             </select>
//           </div>
//           <div style={styles.col}>
//             <label style={styles.label}>Session (optional)</label>
//             <input
//               style={styles.input}
//               placeholder="2025-2026"
//               value={session}
//               onChange={e => setSession(e.target.value)}
//             />
//           </div>
//           <div style={styles.col}>
//             <label style={styles.label}>Valid till (optional)</label>
//             <input
//               type="date"
//               style={styles.input}
//               value={validTill}
//               onChange={e => setValidTill(e.target.value)}
//             />
//           </div>
//         </div>

//         <div>
//           <label style={styles.label}>Title</label>
//           <input
//             style={styles.input}
//             value={title}
//             onChange={e => setTitle(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label style={styles.label}>Message</label>
//           <textarea
//             rows={3}
//             style={{ ...styles.input, resize: 'vertical' }}
//             value={message}
//             onChange={e => setMessage(e.target.value)}
//             required
//           />
//         </div>

//         {info && <p style={styles.msg}>{info}</p>}

//         <button type="submit" style={styles.btn}>
//           Save Notification
//         </button>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     background: '#fff',
//     borderRadius: 18,
//     padding: 24,
//     boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
//   },
//   title: { fontSize: 20, fontWeight: 600, marginBottom: 16 },
//   form: { display: 'flex', flexDirection: 'column', gap: 12 },
//   row: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
//     gap: 12
//   },
//   col: { display: 'flex', flexDirection: 'column', gap: 4 },
//   label: { fontSize: 12, fontWeight: 500, color: '#4b5563' },
//   input: {
//     padding: '8px 10px',
//     borderRadius: 10,
//     border: '1px solid #e5e7eb',
//     fontSize: 14
//   },
//   msg: { fontSize: 13, color: '#4b5563' },
//   btn: {
//     marginTop: 8,
//     padding: '9px 0',
//     borderRadius: 10,
//     border: 'none',
//     background: '#111827',
//     color: '#fff',
//     fontWeight: 600,
//     cursor: 'pointer'
//   }
// };

// export default AdminNotifications;
import { useState } from "react";
import api from "../../api/axios";

const AdminNotifications = () => {
  const [audience, setAudience] = useState("all");
  const [session, setSession] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [validTill, setValidTill] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfo("");

    try {
      await api.post("/admin/notifications", {
        audience,
        session: session || null,
        title,
        message,
        validTill: validTill || null
      });

      setInfo("Notification created");
      setTitle("");
      setMessage("");
      setValidTill("");
    } catch (err) {
      setInfo(
        err.response?.data?.message ||
          "Failed to create notification"
      );
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Create Notification</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* TOP ROW */}
        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Audience</label>

            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              style={styles.input}
            >
              <option value="all">All</option>
              <option value="students">Students</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div style={styles.col}>
            <label style={styles.label}>Session (optional)</label>

            <input
              style={styles.input}
              placeholder="2025-2026"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            />
          </div>

          <div style={styles.col}>
            <label style={styles.label}>Valid till (optional)</label>

            <input
              type="date"
              style={styles.input}
              value={validTill}
              onChange={(e) => setValidTill(e.target.value)}
            />
          </div>
        </div>

        {/* TITLE */}
        <div>
          <label style={styles.label}>Title</label>

          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* MESSAGE */}
        <div>
          <label style={styles.label}>Message</label>

          <textarea
            rows={3}
            style={{ ...styles.input, resize: "vertical" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {info && <p style={styles.msg}>{info}</p>}

        <button type="submit" style={styles.btn}>
          Save Notification
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    background: "#fff",
    borderRadius: 18,
    padding: "22px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    maxWidth: "800px",
    margin: "0 auto"
  },

  title: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 18
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14
  },

  /* ⭐ RESPONSIVE GRID */
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: 14
  },

  col: {
    display: "flex",
    flexDirection: "column",
    gap: 4
  },

  label: {
    fontSize: 12,
    fontWeight: 500,
    color: "#4b5563"
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 14
  },

  msg: {
    fontSize: 13,
    color: "#4b5563"
  },

  btn: {
    marginTop: 10,
    padding: "11px",
    borderRadius: 10,
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer"
  }
};

export default AdminNotifications;
