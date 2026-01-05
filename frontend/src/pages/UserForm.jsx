import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const empty = {
  name: "", email: "", phone: "", company: "",
  address: { street: "", city: "", zip: "", geo: { lat: "", lng: "" } }
};

export default function UserForm({ edit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (edit && id) {
      api.get(`/users/${id}`).then(res => setForm(res.data));
    }
  }, [edit, id]);

  const set = (path, value) => {
    const parts = path.split(".");
    const copy = JSON.parse(JSON.stringify(form));
    let cur = copy;
    while (parts.length > 1) cur = cur[parts.shift()];
    cur[parts[0]] = value;
    setForm(copy);
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "Required";
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.phone) errs.phone = "Required";
    if (!form.company) errs.company = "Required";
    if (!form.address.city) errs.city = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (edit) await api.put(`/users/${id}`, form);
    else await api.post("/users", form);
    navigate("/");
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h3>{edit ? "Edit" : "Create"} User</h3>
      <input placeholder="Name" value={form.name} onChange={e=>set("name", e.target.value)} />
      {errors.name && <span>{errors.name}</span>}<br/>
      <input placeholder="Email" value={form.email} onChange={e=>set("email", e.target.value)} />
      {errors.email && <span>{errors.email}</span>}<br/>
      <input placeholder="Phone" value={form.phone} onChange={e=>set("phone", e.target.value)} /><br/>
      <input placeholder="Company" value={form.company} onChange={e=>set("company", e.target.value)} /><br/>
      <input placeholder="Street" value={form.address.street} onChange={e=>set("address.street", e.target.value)} /><br/>
      <input placeholder="City" value={form.address.city} onChange={e=>set("address.city", e.target.value)} /><br/>
      <input placeholder="Zip" value={form.address.zip} onChange={e=>set("address.zip", e.target.value)} /><br/>
      <input placeholder="Lat" value={form.address.geo.lat} onChange={e=>set("address.geo.lat", e.target.value)} /><br/>
      <input placeholder="Lng" value={form.address.geo.lng} onChange={e=>set("address.geo.lng", e.target.value)} /><br/>
      <button type="submit">Save</button>
    </form>
  );
}
