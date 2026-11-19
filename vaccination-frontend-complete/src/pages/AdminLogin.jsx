import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../App";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid admin credentials");
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message || "Backend server is not running");
    } finally { setLoading(false); }
  }

  return (
    <div className="login-page">
      <header className="navbar"><div className="logo"><span className="logo-icon">✚</span> VaxCare</div></header>
      <div className="login-background">
        <div className="login-card">
          <div className="login-icon">🛡️</div>
          <h1>ADMIN LOGIN</h1>
          <p className="login-subtitle">Access center and user management</p>
          <form onSubmit={handleLogin}>
            <label>Username</label>
            <input className="field" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" required />
            <label>Password</label>
            <input className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            {error && <div className="error-message">{error}</div>}
            <button className="login-button" disabled={loading}>{loading ? "LOGGING IN..." : "LOGIN"}</button>
          </form>
          <p className="hint">Demo admin: <b>admin</b> / <b>Nimda</b></p>
          <button className="back-button" onClick={() => navigate("/")}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}