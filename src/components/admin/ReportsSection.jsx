// src/components/admin/ReportsSection.jsx
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api.js';
import '../../styles/AdminPanel.css';

const ReportsSection = ({ token }) => {
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/ingredients`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setIngredients(data))
            .catch(err => console.error(err));
    }, [token]);

    const lowStock = ingredients.filter(i => i.stock < 20);

    return (
        <div className="section-container">
            <div className="section-header">
                <h2>Reportes de Inventario</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Low Stock Alert */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#c0392b', borderBottom: '2px solid #c0392b', paddingBottom: '10px' }}>
                        ⚠️ Alerta: Stock Crítico (Menos de 20)
                    </h3>
                    {lowStock.length === 0 ? (
                        <p style={{ color: 'green' }}>✅ Todo el inventario está saludable.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {lowStock.map(ing => (
                                <li key={ing.id} style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>{ing.name}</span>
                                    <strong style={{ color: 'red' }}>{ing.stock} u.</strong>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Inventory Summary */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#2980b9', borderBottom: '2px solid #2980b9', paddingBottom: '10px' }}>
                        📋 Resumen de Insumos
                    </h3>
                    <p>Total de tipos de ingredientes: <strong>{ingredients.length}</strong></p>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '0.9em' }}>
                            <thead>
                                <tr style={{ textAlign: 'left' }}>
                                    <th>Ingrediente</th>
                                    <th>Stock Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingredients.map(ing => (
                                    <tr key={ing.id}>
                                        <td style={{ padding: '5px 0' }}>{ing.name}</td>
                                        <td style={{
                                            padding: '5px 0',
                                            color: ing.stock < 20 ? 'red' : 'inherit',
                                            fontWeight: ing.stock < 20 ? 'bold' : 'normal'
                                        }}>
                                            {ing.stock}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsSection;
