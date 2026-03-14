import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import type { Notita } from "../api/types";

export default function Dashboard() {
  const [notitas, setNotitas] = useState<Notita[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = api.getAccessToken();
    if (!token) {
      navigate("/login");
    } else {
      loadNotitas();
    }
  }, [navigate]);

  const loadNotitas = async () => {
    try {
      const data = await api.getNotitas();
      setNotitas(data.notitas);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        navigate("/login");
      } else {
        setError(err instanceof Error ? err.message : "Error al cargar notas");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await api.updateNotita(editingId, title, content);
        setEditingId(null);
      } else {
        await api.createNotita(title, content);
      }
      setTitle("");
      setContent("");
      loadNotitas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar nota");
    }
  };

  const handleEdit = (notita: Notita) => {
    setTitle(notita.title);
    setContent(notita.content);
    setEditingId(notita.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteNotita(id);
      loadNotitas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar nota");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>💌 Mis Cartitas</h1>
        <div style={styles.userInfo}>
          <span style={styles.userEmail}>💕 {user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Cerrar Sesión 💔
          </button>
        </div>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Título de tu cartita 💕"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Escribe tu mensaje de amor... ❤️"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />
        <div style={styles.formButtons}>
          <button type="submit" style={styles.submitBtn}>
            {editingId ? "Actualizar 💕" : "Crear Cartita 💌"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} style={styles.cancelBtn}>
              Cancelar 💔
            </button>
          )}
        </div>
      </form>

      <div style={styles.notesHeader}>
        <span style={styles.notesTitle}>💕 Cartitas para María José 💕</span>
        <span style={styles.notesCount}>{notitas.length} {notitas.length === 1 ? 'cartita' : 'cartitas'} de amor ❤️</span>
      </div>

      {loading ? (
        <p style={styles.loading}>Cargando tus cartitas...</p>
      ) : notitas.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyHeart}>💌</span>
          <p>Aún no hay cartitas...</p>
          <p>¡Escribe la primera para tu amor! 💕</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {notitas.map((notita) => (
            <div key={notita.id} style={styles.card}>
              <div style={styles.cardHeart}>❤️</div>
              <h3 style={styles.cardTitle}>{notita.title}</h3>
              <p style={styles.cardContent}>{notita.content}</p>
              <div style={styles.cardActions}>
                <button onClick={() => handleEdit(notita)} style={styles.editBtn}>
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(notita.id)}
                  style={styles.deleteBtn}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff0f3 0%, #ffe4e9 50%, #ffd1dc 100%)",
    padding: "2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    padding: "1rem",
    background: "rgba(255, 255, 255, 0.8)",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(255, 105, 135, 0.2)",
  },
  title: {
    color: "#e91e63",
    margin: 0,
    fontSize: "1.8rem",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userEmail: {
    color: "#ff69b4",
    fontWeight: "500",
  },
  logoutBtn: {
    padding: "0.5rem 1rem",
    background: "#ff4757",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
    padding: "1.5rem",
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(255, 105, 135, 0.2)",
    border: "2px solid #ffb6c1",
  },
  input: {
    padding: "0.875rem",
    border: "2px solid #ffb6c1",
    borderRadius: "12px",
    fontSize: "1rem",
    outline: "none",
  },
  textarea: {
    padding: "0.875rem",
    border: "2px solid #ffb6c1",
    borderRadius: "12px",
    fontSize: "1rem",
    minHeight: "100px",
    resize: "vertical",
    outline: "none",
  },
  formButtons: {
    display: "flex",
    gap: "1rem",
  },
  submitBtn: {
    padding: "0.875rem 1.5rem",
    background: "linear-gradient(135deg, #ff69b4 0%, #e91e63 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600",
  },
  cancelBtn: {
    padding: "0.875rem 1.5rem",
    background: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },
  notesHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  notesTitle: {
    color: "#e91e63",
    fontSize: "1.2rem",
    fontWeight: "600",
  },
  notesCount: {
    color: "#ff69b4",
    fontWeight: "500",
  },
  loading: {
    textAlign: "center",
    color: "#ff69b4",
    fontSize: "1.1rem",
  },
  empty: {
    textAlign: "center",
    padding: "3rem",
    color: "#ff69b4",
  },
  emptyHeart: {
    fontSize: "4rem",
    display: "block",
    marginBottom: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    padding: "1.5rem",
    background: "white",
    border: "2px solid #ffb6c1",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(255, 105, 135, 0.15)",
    position: "relative",
  },
  cardHeart: {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    fontSize: "1.5rem",
  },
  cardTitle: {
    color: "#e91e63",
    marginBottom: "0.5rem",
    marginTop: "0",
  },
  cardContent: {
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "1rem",
  },
  cardActions: {
    display: "flex",
    gap: "0.5rem",
  },
  editBtn: {
    padding: "0.5rem 1rem",
    background: "#ffc107",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
  deleteBtn: {
    padding: "0.5rem 1rem",
    background: "#ff4757",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
  error: {
    color: "#d32f2f",
    marginBottom: "1rem",
    padding: "0.75rem",
    background: "#ffebee",
    borderRadius: "8px",
    textAlign: "center",
  },
};
