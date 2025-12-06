// src/components/admin/AdminLayout.jsx
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';
import '../../styles/AdminPanel.css';

const AdminLayout = ({ children, activeSection, setActiveSection }) => {
    return (
        <div className="admin-layout" style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#f4f6f9'
        }}>
            {/* Sidebar */}
            <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            {/* Main Content */}
            <div className="admin-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <AdminHeader />
                <main style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
