// src/components/admin/UsersSection.jsx
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api.js';
import '../../styles/AdminPanel.css';

const UsersSection = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        role: 'CLIENTE',
        run: '',
        status: 'active'
    });

    const loadUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (response.ok) {
                const data = await response.json();
                const mappedUsers = data.map(u => ({
                    id: u.id,
                    name: u.firstName,
                    lastname: u.lastName,
                    email: u.username,
                    role: u.role === 'ADMIN' ? 'admin' : 'user',
                    rawRole: u.role,
                    status: u.status || 'active',
                    run: u.run || ''
                }));
                setUsers(mappedUsers);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (token) loadUsers();
    }, [token]);

    const handleOpenForm = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name || '',
                lastname: user.lastname || '',
                email: user.email || '',
                password: '',
                role: user.rawRole || 'CLIENTE',
                run: user.run || '',
                status: user.status || 'active'
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', lastname: '', email: '', password: '', role: 'CLIENTE', run: '', status: 'active' });
        }
        setShowForm(true);
    };

    const validateForm = () => {
        if (!formData.name.trim()) { alert("Falta el Nombre"); return false; }
        if (!formData.lastname.trim()) { alert("Falta el Apellido"); return false; }
        if (!formData.email.trim()) { alert("Falta el Email"); return false; }
        if (!editingUser && !formData.password) {
            alert("Falta la Contraseña (es usuario nuevo)");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const backendData = {
            firstName: formData.name,
            lastName: formData.lastname,
            username: formData.email,
            role: formData.role === 'admin' ? 'ADMIN' : formData.role,
            run: formData.run,
            status: formData.status
        };

        if (formData.password && formData.password.trim() !== "") {
            backendData.password = formData.password;
        }

        try {
            let url = `${API_BASE_URL}/api/auth/register`;
            let method = 'POST';

            if (editingUser) {
                url = `${API_BASE_URL}/api/users/${editingUser.id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(backendData)
            });

            if (response.ok) {
                alert(editingUser ? "Usuario actualizado ✓" : "Usuario creado ✓");
                loadUsers();
                setShowForm(false);
            } else {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                alert("Error al guardar. Revisa la consola.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Borrar usuario?")) return;
        await fetch(`${API_BASE_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        loadUsers();
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="section-container">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Gestión de Usuarios</h2>
                <button
                    onClick={() => handleOpenForm()}
                    style={{ background: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}
                >
                    + Nuevo Usuario
                </button>
            </div>

            {showForm && (
                <div style={{ background: '#f9f9f9', padding: '20px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
                        <input
                            name="name"
                            placeholder="Nombre"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            style={{ padding: '10px' }}
                        />
                        <input
                            name="lastname"
                            placeholder="Apellido"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            required
                            style={{ padding: '10px' }}
                        />
                        <input
                            name="email"
                            placeholder="Usuario/Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            style={{ padding: '10px' }}
                        />
                        <input
                            name="run"
                            placeholder="RUN"
                            value={formData.run}
                            onChange={handleInputChange}
                            style={{ padding: '10px' }}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder={editingUser ? "Nueva Contraseña (dejar en blanco para mantener)" : "Contraseña"}
                            value={formData.password}
                            onChange={handleInputChange}
                            required={!editingUser}
                            style={{ padding: '10px' }}
                        />
                        <select name="role" value={formData.role} onChange={handleInputChange} style={{ padding: '10px' }}>
                            <option value="CLIENTE">Usuario</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px' }}>
                                Cancelar
                            </button>
                            <button type="submit" style={{ background: '#2980b9', color: 'white', padding: '10px 20px', cursor: 'pointer', border: 'none', borderRadius: '5px' }}>
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                <thead style={{ background: '#34495e', color: 'white' }}>
                    <tr>
                        <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Usuario</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Nombre</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Rol</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '15px' }}>{u.id}</td>
                            <td style={{ padding: '15px' }}>{u.email}</td>
                            <td style={{ padding: '15px' }}>{u.name} {u.lastname}</td>
                            <td style={{ padding: '15px' }}>
                                <span style={{
                                    padding: '3px 8px',
                                    borderRadius: '10px',
                                    background: u.role === 'admin' ? '#9b59b6' : '#3498db',
                                    color: 'white',
                                    fontSize: '0.8em'
                                }}>
                                    {u.role}
                                </span>
                            </td>
                            <td style={{ padding: '15px' }}>
                                <button onClick={() => handleOpenForm(u)} style={{ marginRight: '10px', cursor: 'pointer' }}>
                                    ✏️ Editar
                                </button>
                                {u.role !== 'admin' && (
                                    <button onClick={() => handleDelete(u.id)} style={{ color: 'red', cursor: 'pointer' }}>
                                        🗑️ Borrar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersSection;
