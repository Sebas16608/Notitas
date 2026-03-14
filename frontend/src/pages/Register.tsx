import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hearts}>
        <span style={styles.heart}>❤️</span>
        <span style={styles.heart}>💕</span>
        <span style={styles.heart}>💗</span>
        <span style={styles.heart}>💖</span>
        <span style={styles.heart}>❤️</span>
      </div>
      <div style={styles.card}>
        <h2 style={styles.title}>💕 Regístrate</h2>
        <p style={styles.subtitle}>Para {name || "mi amor"} 💌</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Cargando..." : "Crear cuenta 💕"}
          </button>
        </form>
        <p style={styles.link}>
          ¿Ya tienes cuenta? <Link to="/login" style={styles.linkText}>Inicia Sesión</Link>
        </p>
      </div>
      <div style={styles.hearts}>
        <span style={styles.heart}>💗</span>
        <span style={styles.heart}>❤️</span>
        <span style={styles.heart}>💖</span>
        <span style={styles.heart}>💕</span>
        <span style={styles.heart}>💗</span>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #ffe6ea 0%, #ffc2d1 50%, #ff9eb5 100%)",
    padding: "2rem",
  },
  hearts: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },
  heart: {
    fontSize: "1.5rem",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "2.5rem",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(255, 105, 135, 0.3)",
    width: "100%",
    maxWidth: "400px",
    border: "2px solid #ffb6c1",
  },
  title: {
    color: "#e91e63",
    textAlign: "center",
    marginBottom: "0.5rem",
    fontSize: "1.8rem",
  },
  subtitle: {
    color: "#ff69b4",
    textAlign: "center",
    marginBottom: "1.5rem",
    fontSize: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.875rem",
    border: "2px solid #ffb6c1",
    borderRadius: "12px",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "0.875rem",
    background: "linear-gradient(135deg, #ff69b4 0%, #e91e63 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    cursor: "pointer",
    fontWeight: "600",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  error: {
    color: "#d32f2f",
    marginBottom: "1rem",
    padding: "0.75rem",
    background: "#ffebee",
    borderRadius: "8px",
    textAlign: "center",
  },
  link: {
    marginTop: "1.5rem",
    textAlign: "center",
    color: "#ff69b4",
  },
  linkText: {
    color: "#e91e63",
    fontWeight: "600",
  },
};
