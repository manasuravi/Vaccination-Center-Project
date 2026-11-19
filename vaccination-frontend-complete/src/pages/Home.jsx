import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <header className="navbar">
        <div className="logo"><span className="logo-icon">✚</span> VaxCare</div>
        <div className="tagline">Vaccination for a Healthier Tomorrow</div>
      </header>
      <main className="hero">
        <div className="hero-content">
          <h1>VaxCare</h1>
          <h2>Vaccination Management System</h2>
          <p>Find vaccination centers, register as a user, book vaccinations and manage centers.</p>
          <div className="home-buttons">
            <button className="btn user-btn" onClick={() => navigate("/user-login")}>👤 User Login</button>
            <button className="btn register-btn" onClick={() => navigate("/user-register")}>👥 User Register</button>
            <button className="btn admin-btn" onClick={() => navigate("/admin-login")}>🛡 Admin Login</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="vaccine-circle">💉</div>
          <div className="vaccine-bottle">💊</div>
          <div className="shield">🛡️</div>
        </div>
      </main>
    </div>
  );
}