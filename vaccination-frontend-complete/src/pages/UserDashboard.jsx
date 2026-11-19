import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../App";

export default function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [centers, setCenters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pin, setPin] = useState(user?.pinCode || "");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [booking, setBooking] = useState(false);

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const loadCenters = useCallback(async (searchPin = pin) => {
    setLoadingCenters(true);
    setError("");
    try {
      const response = await fetch(
        `${API}/vaccinations/centers?pinCode=${encodeURIComponent(searchPin.trim())}`
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to load centers");
      setCenters(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server");
      setCenters([]);
    } finally {
      setLoadingCenters(false);
    }
  }, [pin]);

  const loadBookings = useCallback(async () => {
    if (!user?.id) return;
    setLoadingBookings(true);
    try {
      const response = await fetch(`${API}/vaccinations/user/${user.id}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to load bookings");
      setBookings(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message || "Unable to load your bookings");
    } finally {
      setLoadingBookings(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      navigate("/user-login", { replace: true });
      return;
    }
    loadCenters(user.pinCode || "");
    loadBookings();
  }, []); // Load the signed-in user's data once when the dashboard opens.

  async function bookVaccination() {
    if (!date) {
      setError("Please select a vaccination date.");
      setMessage("");
      return;
    }
    if (date < minDate) {
      setError("Please select today or a future date.");
      setMessage("");
      return;
    }
    if (!user?.id) {
      navigate("/user-login");
      return;
    }

    setError("");
    setMessage("");
    setBooking(true);
    try {
      // The current backend chooses the first available center using the
      // PIN code saved in this user's registration profile.
      const response = await fetch(`${API}/vaccinations/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          vaccinationDate: date
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Booking failed");

      setMessage(result.message || "Vaccination booked successfully.");
      setDate("");
      await Promise.all([loadCenters(user.pinCode || ""), loadBookings()]);
    } catch (err) {
      setError(err.message || "Unable to book vaccination. Please try again.");
    } finally {
      setBooking(false);
    }
  }

  async function cancelBooking(id) {
    if (!window.confirm("Are you sure you want to cancel this vaccination?")) return;

    setError("");
    setMessage("");
    try {
      // Backend route is DELETE /api/vaccinations/:id (there is no /cancel suffix).
      const response = await fetch(`${API}/vaccinations/${id}`, {
        method: "DELETE"
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Cancellation failed");

      setMessage(result.message || "Vaccination cancelled successfully.");
      await Promise.all([loadCenters(user.pinCode || ""), loadBookings()]);
    } catch (err) {
      setError(err.message || "Unable to cancel this booking.");
    }
  }

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo"><span className="logo-icon">✚</span> VaxCare</div>
        <div className="user-box"><b>{user?.name}</b><small>{user?.email}</small></div>
        <button className="menu-item active" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>🏥 Find Centers</button>
        <button className="menu-item" onClick={() => document.getElementById("my-vaccinations")?.scrollIntoView({ behavior: "smooth" })}>💉 My Vaccinations</button>
        <button className="logout-button" onClick={logout}>🚪 Logout</button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>USER DASHBOARD</h1>
          <div>👤 {user?.name}</div>
        </header>

        <div className="dashboard-content">
          {error && <div className="error-message" role="alert">{error}</div>}
          {message && <div className="success-message" role="status">{message}</div>}

          <section className="table-card form-card">
            <div className="table-title">🔎 Find Vaccination Centers</div>
            <div className="search-row">
              <input
                className="field"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="Enter PIN code"
                inputMode="numeric"
                maxLength={10}
              />
              <button className="primary-action" onClick={() => loadCenters(pin)} disabled={loadingCenters}>
                {loadingCenters ? "Searching..." : "Search"}
              </button>
            </div>
            <p className="login-subtitle">
              Your registered PIN code is {user?.pinCode || "not available"}. Booking is assigned by the backend using this registered PIN code.
            </p>
          </section>

          <section className="table-card form-card">
            <div className="table-title">📅 Book a Vaccination</div>
            <div className="search-row">
              <input
                className="field"
                type="date"
                min={minDate}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
              <button className="primary-action" onClick={bookVaccination} disabled={booking}>
                {booking ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
            <p className="login-subtitle">
              The backend assigns the first active center with available slots matching your registered PIN code.
            </p>
          </section>

          <section className="table-card">
            <div className="table-title">
              <span>🏥 Available Centers</span>
              <span className="count-badge">{centers.length}</span>
            </div>
            <div className="table-container">
              <table>
                <thead><tr><th>Name</th><th>City</th><th>Address</th><th>Vaccine</th><th>Slots</th></tr></thead>
                <tbody>
                  {loadingCenters ? (
                    <tr><td colSpan="5" className="empty">Loading centers...</td></tr>
                  ) : centers.length === 0 ? (
                    <tr><td colSpan="5" className="empty">No active center with available slots for this PIN code.</td></tr>
                  ) : centers.map((center) => (
                    <tr key={center.id}>
                      <td className="bold">{center.name}</td>
                      <td>{center.city}</td>
                      <td>{center.address}</td>
                      <td>{center.vaccine_name}</td>
                      <td>{center.available_slots}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="table-card" id="my-vaccinations">
            <div className="table-title">💉 My Vaccinations</div>
            <div className="table-container">
              <table>
                <thead><tr><th>ID</th><th>Center</th><th>Vaccine</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {loadingBookings ? (
                    <tr><td colSpan="6" className="empty">Loading your bookings...</td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td colSpan="6" className="empty">No bookings yet</td></tr>
                  ) : bookings.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.center_name}</td>
                      <td>{item.vaccine_name}</td>
                      <td>{String(item.vaccination_date).slice(0, 10)}</td>
                      <td>{item.status}</td>
                      <td>
                        {item.status === "BOOKED" && (
                          <button className="small-btn delete" onClick={() => cancelBooking(item.id)}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
