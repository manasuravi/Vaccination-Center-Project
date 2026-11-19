import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../App";

const emptyCenter = {name:"", address:"", city:"", state:"", pinCode:"", contactNumber:"", vaccineName:"", availableSlots:0, status:"ACTIVE"};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("centers");
  const [centers, setCenters] = useState([]);
  const [users, setUsers] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [form, setForm] = useState(emptyCenter);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") { navigate("/admin-login"); return; }
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true); setError("");
    try {
      const [c,u,v] = await Promise.all([
        fetch(`${API}/admin/centers`), fetch(`${API}/admin/users`), fetch(`${API}/admin/vaccinations`)
      ]);
      const cd = await c.json(), ud = await u.json(), vd = await v.json();
      if (!c.ok) throw new Error(cd.message || "Unable to fetch centers");
      if (!u.ok) throw new Error(ud.message || "Unable to fetch users");
      if (!v.ok) throw new Error(vd.message || "Unable to fetch vaccinations");
      setCenters(cd.data || []); setUsers(ud.data || []); setVaccinations(vd.data || []);
    } catch(e) { setError(e.message); } finally { setLoading(false); }
  }

  const change = e => setForm({...form, [e.target.name]: e.target.value});
  function edit(c) {
    setEditingId(c.id);
    setForm({name:c.name,address:c.address,city:c.city,state:c.state,pinCode:c.pin_code,contactNumber:c.contact_number,vaccineName:c.vaccine_name,availableSlots:c.available_slots,status:c.status});
    window.scrollTo({top:0, behavior:"smooth"});
  }
  function resetForm() { setEditingId(null); setForm(emptyCenter); }

  async function saveCenter(e) {
    e.preventDefault(); setMessage(""); setError("");
    const url = editingId ? `${API}/admin/centers/${editingId}` : `${API}/admin/centers`;
    try {
      const res = await fetch(url, {method: editingId ? "PUT":"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...form, availableSlots:Number(form.availableSlots)})});
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");
      setMessage(editingId ? "Center updated successfully." : "Center created successfully.");
      resetForm(); await loadAll();
    } catch(e) { setError(e.message); }
  }

  async function removeCenter(id) {
    if (!window.confirm("Delete this vaccination center?")) return;
    setMessage(""); setError("");
    try {
      const res = await fetch(`${API}/admin/centers/${id}`, {method:"DELETE"});
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      setMessage("Center deleted successfully."); await loadAll();
    } catch(e) { setError(e.message); }
  }

  function logout() { localStorage.removeItem("adminLoggedIn"); navigate("/"); }

  return <div className="dashboard-page">
    <aside className="sidebar">
      <div className="sidebar-logo"><span className="logo-icon">✚</span> VaxCare</div>
      <div className="menu">
        <button className={`menu-item ${tab==="centers"?"active":""}`} onClick={() => setTab("centers")}>🏥 Vaccination Centers</button>
        <button className={`menu-item ${tab==="users"?"active":""}`} onClick={() => setTab("users")}>👥 Users</button>
        <button className={`menu-item ${tab==="vaccinations"?"active":""}`} onClick={() => setTab("vaccinations")}>💉 Vaccinations</button>
      </div>
      <button className="logout-button" onClick={logout}>🚪 Logout</button>
    </aside>
    <main className="dashboard-main">
      <header className="dashboard-header"><h1>ADMIN DASHBOARD</h1><div>👤 admin</div></header>
      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        {loading ? <div className="loading">Loading...</div> : <>
          {tab === "centers" && <CentersSection form={form} change={change} saveCenter={saveCenter} editingId={editingId} resetForm={resetForm} centers={centers} edit={edit} removeCenter={removeCenter} />}
          {tab === "users" && <UsersSection users={users} />}
          {tab === "vaccinations" && <VaccinationsSection data={vaccinations} />}
        </>}
      </div>
    </main>
  </div>;
}

function CentersSection({form,change,saveCenter,editingId,resetForm,centers,edit,removeCenter}) {
  return <>
    <section className="table-card form-card">
      <div className="table-title"><span>{editingId ? "✏️ Edit Vaccination Center" : "➕ Add Vaccination Center"}</span><span className="count-badge">{centers.length} centers</span></div>
      <form className="center-form" onSubmit={saveCenter}>
        <div className="form-grid">
          {[
            ["name","Name"],["address","Address"],["city","City"],["state","State"],
            ["pinCode","PIN Code"],["contactNumber","Contact Number"],["vaccineName","Vaccine Name"],["availableSlots","Available Slots"]
          ].map(([name,label]) => <div key={name}><label>{label}</label><input className="field" name={name} value={form[name]} onChange={change} type={name==="availableSlots"?"number":"text"} min={name==="availableSlots"?0:undefined} required /></div>)}
          <div><label>Status</label><select className="field" name="status" value={form.status} onChange={change}><option>ACTIVE</option><option>INACTIVE</option></select></div>
        </div>
        <div className="form-actions"><button className="primary-action">{editingId ? "Update Center" : "Create Center"}</button>{editingId && <button type="button" className="secondary-action" onClick={resetForm}>Cancel Edit</button>}</div>
      </form>
    </section>
    <section className="table-card">
      <div className="table-title"><span>🏥 Vaccination Centers</span><span className="count-badge">{centers.length}</span></div>
      <div className="table-container"><table><thead><tr><th>ID</th><th>Name</th><th>Address</th><th>City</th><th>State</th><th>PIN</th><th>Vaccine</th><th>Slots</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{centers.length===0 ? <tr><td colSpan="10" className="empty">No centers found</td></tr> : centers.map(c => <tr key={c.id}>
        <td>{c.id}</td><td className="bold">{c.name}</td><td>{c.address}</td><td>{c.city}</td><td>{c.state}</td><td>{c.pin_code}</td><td>{c.vaccine_name}</td><td>{c.available_slots}</td>
        <td><span className={`status ${c.status==="ACTIVE"?"active":"inactive"}`}>{c.status}</span></td>
        <td className="actions"><button className="small-btn edit" onClick={() => edit(c)}>Edit</button><button className="small-btn delete" onClick={() => removeCenter(c.id)}>Delete</button></td>
      </tr>)}</tbody></table></div>
    </section>
  </>;
}
function UsersSection({users}) {
  return <section className="table-card"><div className="table-title"><span>👥 Registered Users</span><span className="count-badge">{users.length}</span></div><div className="table-container"><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>PIN</th><th>Created</th></tr></thead><tbody>{users.length===0?<tr><td colSpan="6" className="empty">No users found</td></tr>:users.map(u=><tr key={u.id}><td>{u.id}</td><td className="bold">{u.name}</td><td>{u.email}</td><td>{u.phone}</td><td>{u.pin_code}</td><td>{u.created_at?new Date(u.created_at).toLocaleDateString():"-"}</td></tr>)}</tbody></table></div></section>;
}
function VaccinationsSection({data}) {
  return <section className="table-card"><div className="table-title"><span>💉 Vaccination Bookings</span><span className="count-badge">{data.length}</span></div><div className="table-container"><table><thead><tr><th>ID</th><th>User</th><th>Center</th><th>Vaccine</th><th>Date</th><th>Status</th></tr></thead><tbody>{data.length===0?<tr><td colSpan="6" className="empty">No vaccinations found</td></tr>:data.map(v=><tr key={v.id}><td>{v.id}</td><td>{v.user_name || v.user_id}</td><td>{v.center_name || v.center_id}</td><td>{v.vaccine_name}</td><td>{v.vaccination_date}</td><td>{v.status}</td></tr>)}</tbody></table></div></section>;
}