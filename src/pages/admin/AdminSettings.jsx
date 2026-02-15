import AdminLayout from '../../components/AdminLayout';
import '../../styles/dashboard-common.css';

const AdminSettings = () => {
  return (
    <AdminLayout pageTitle="Settings">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-settings-line"></i>
        </div>
        <h1>Admin <span>Settings</span></h1>
        <p>Configure platform settings, user permissions, notification preferences, and system-wide configurations.</p>
      </div>
    </AdminLayout>
  );
};
export default AdminSettings;
