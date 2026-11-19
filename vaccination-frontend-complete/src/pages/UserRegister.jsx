import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../App";

export default function UserRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({name:"", email:"", password:"", phone:"", pinCode:""});
  const [error, setError] = useState(""); const [success, setSuccess] = useState(""); const [loading, setLoading] = useState(false);
  const change = e => setForm({...form, [e.target.name]: e.target.value});

  async function submit(e) {
    e.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch(`${API}/users/register`, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)});
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setSuccess("Registration successful. You can login now.");
      setTimeout(() => navigate("/user-login"), 800);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  return <div className="login-page"><header className="navbar"><div className="logo"><span className="logo-icon">✚</span> VaxCare</div></header>
    <div className="login-background"><div className="login-card wide"><div className="login-icon">👥</div><h1>USER REGISTRATION</h1><p className="login-subtitle">Create your VaxCare account</p>
      <form onSubmit={submit}>
        <div className="form-grid">
          <div><label>Name</label><input className="field" name="name" value={form.name} onChange={change} required /></div>
          <div><label>Email</label><input className="field" type="email" name="email" value={form.email} onChange={change} required /></div>
          <div><label>Password</label><input className="field" type="password" name="password" value={form.password} onChange={change} required /></div>
          <div><label>Phone</label><input className="field" name="phone" value={form.phone} onChange={change} required /></div>
          <div><label>PIN Code</label><input className="field" name="pinCode" value={form.pinCode} onChange={change} required /></div>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button className="login-button" disabled={loading}>{loading ? "CREATING..." : "REGISTER"}</button>
      </form>
      <p className="switch-text">Already registered? <button className="link-button" onClick={() => navigate("/user-login")}>Login</button></p>
      <button className="back-button" onClick={() => navigate("/")}>← Back to Home</button>
    </div></div></div>;
}