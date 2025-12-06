// src/components/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api.js';
import '../../styles/AdminPanel.css';

const Dashboard = ({ token }) => {
    const [stats, setStats] = useState({
        ordersCount: 0,
        salesTotal: 0,
        usersCount: 0
    });

    useEffect(() => {
        if (!token) return;

        const loadData = async () => {
            try {
                // 1. Fetch Orders
                const resOrders = await fetch(`${API_BASE_URL}/api/orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const orders = await resOrders.json();

                // Calculate total sales
                const totalMoney = orders.reduce((acc, order) => {
                    const orderSum = order.items ? order.items.reduce((s, i) => s + (i.price * i.quantity), 0) : 0;
                    return acc + orderSum;
                }, 0);

                // 2. Fetch Users
                const resUsers = await fetch(`${API_BASE_URL}/api/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const users = await resUsers.json();

                setStats({
                    ordersCount: orders.length,
                    salesTotal: totalMoney,
                    usersCount: users.length
                });

            } catch (error) {
                console.error("Error loading dashboard:", error);
            }
        };

        loadData();
    }, [token]);

    const cardStyle = {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flex: 1,
        textAlign: 'center',
        minWidth: '200px'
    };

    return (
        <div className="dashboard-container">
            <h2>Panel General</h2>
            <p>Resumen de actividad de la Pixzelería</p>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
                <div style={cardStyle}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
                    <h3>Pedidos Totales</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0 }}>{stats.ordersCount}</p>
                </div>

                <div style={cardStyle}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
                    <h3>Ingresos Totales</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#27ae60' }}>
                        ${stats.salesTotal.toLocaleString('es-CL')}
                    </p>
                </div>

                <div style={cardStyle}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>👥</div>
                    <h3>Usuarios Registrados</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#2980b9' }}>
                        {stats.usersCount}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
