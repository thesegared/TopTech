import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import api from "../../api";
import "./ManageRoles.css";

function ManageRoles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users/all"); // Llama a la ruta del backend
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put("/users/update-role", { userId, newRole }); // Llama al endpoint para actualizar rol
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  };

  const handleEdit = (userId) => {
    console.log(`Edit user ${userId}`); // Aquí puedes implementar la lógica de edición
  };

  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await api.delete(`/users/${userId}`); // Endpoint para eliminar usuario
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="manage-roles-container">
      <h2>Gestión de Roles</h2>
      <table className="roles-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </td>
              <td>
                <div className="actions">
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="action-btn edit-btn"
                  >
                    <FaEdit />
                    <span className="tooltip">Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="action-btn delete-btn"
                  >
                    <MdDeleteForever />
                    <span className="tooltip">Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageRoles;
