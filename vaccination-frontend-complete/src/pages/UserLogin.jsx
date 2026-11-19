import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../App";

export default function UserLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({email:"", password:""});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = e => setForm({...form, [e.target.name]: e.target.value});

  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/users/login`, {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("user", JSON.stringify(data.data));
      navigate("/user-dashboard");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <AuthCard title="USER LOGIN" subtitle="Login to find centers and manage vaccinations" onSubmit={submit}>
    <label>Email</label><input className="field" name="email" type="email" value={form.email} onChange={change} placeholder="Enter email" required />
    <label>Password</label><input className="field" name="password" type="password" value={form.password} onChange={change} placeholder="Enter password" required />
    {error && <div className="error-message">{error}</div>}
    <button className="login-button" disabled={loading}>{loading ? "LOGGING IN..." : "LOGIN"}</button>
    <p className="switch-text">New user? <button type="button" className="link-button" onClick={() => navigate("/user-register")}>Create account</button></p>
  </AuthCard>;
}

function AuthCard({title, subtitle, onSubmit, children}) {
  const navigate = useNavigate();
  return <div className="login-page"><header className="navbar"><div className="logo"><span className="logo-icon">✚</span> VaxCare</div></header>
    <div className="login-background"><div className="login-card"><div className="login-icon">👤</div><h1>{title}</h1><p className="login-subtitle">{subtitle}</p>
      <form onSubmit={onSubmit}>{children}</form>
      <button className="back-button" onClick={() => navigate("/")}>← Back to Home</button>
    </div></div></div>;
}