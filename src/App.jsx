// src/App.jsx - Admin Panel Only
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel.jsx';
import Login from './pages/Login.jsx';
import './App.css';

function ProtectedRoute({ children }) {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Optional: Check if user is admin
    if (user.role !== 'ADMIN') {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h2>Acceso Denegado</h2>
                <p>Solo administradores pueden acceder a este panel.</p>
                <button onClick={() => {
                    sessionStorage.clear();
                    window.location.href = '/login';
                }}>
                    Volver al Login
                </button>
            </div>
        );
    }

    return children;
}

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const savedUser = JSON.parse(sessionStorage.getItem('user') || 'null');
        if (token && savedUser) {
            setUser(savedUser);
        }
    }, []);

    const handleLoginSuccess = () => {
        const savedUser = JSON.parse(sessionStorage.getItem('user') || 'null');
        setUser(savedUser);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/login" 
                    element={
                        user ? <Navigate to="/" replace /> : 
                        <Login onLogin={handleLoginSuccess} />
                    } 
                />
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <AdminPanel />
                        </ProtectedRoute>
                    } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
