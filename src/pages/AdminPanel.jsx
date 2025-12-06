// src/pages/AdminPanel.jsx
import { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import Dashboard from '../components/admin/Dashboard.jsx';
import OrdersSection from '../components/admin/OrdersSection.jsx';
import ProductsSection from '../components/admin/ProductsSection.jsx';
import UsersSection from '../components/admin/UsersSection.jsx';
import ReportsSection from '../components/admin/ReportsSection.jsx';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const token = sessionStorage.getItem('token');

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard token={token} />;
            case 'orders':
                return <OrdersSection token={token} />;
            case 'products':
                return <ProductsSection token={token} />;
            case 'users':
                return <UsersSection token={token} />;
            case 'reports':
                return <ReportsSection token={token} />;
            default:
                return <Dashboard token={token} />;
        }
    };

    return (
        <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
            {renderSection()}
        </AdminLayout>
    );
};

export default AdminPanel;
