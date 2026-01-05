import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function App() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await api.get("/users");
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h2>User Dashboard</h2>
      <Link to="/users/new">Create User</Link>
      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: 12 }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td><Link to={`/users/${u._id}`}>{u.name}</Link></td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>
                <Link to={`/users/${u._id}/edit`}>Edit</Link>{" | "}
                <button onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
