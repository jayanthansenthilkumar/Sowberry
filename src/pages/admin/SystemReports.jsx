import AdminLayout from '../../components/AdminLayout';


const SystemReports = () => {
  return (
    <AdminLayout pageTitle="System Reports">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-file-chart-line"></i>
        </div>
        <h1>System <span>Reports</span></h1>
        <p>Generate and view system reports including usage statistics, audit logs, and compliance documentation.</p>
      </div>
    </AdminLayout>
  );
};
export default SystemReports;
