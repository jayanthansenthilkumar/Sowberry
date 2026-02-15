import AdminLayout from '../../components/AdminLayout';


const ManageStudents = () => {
  return (
    <AdminLayout pageTitle="Manage Students">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-user-line"></i>
        </div>
        <h1>Manage <span>Students</span></h1>
        <p>View student profiles, manage enrollments, handle verifications, and track individual student progress.</p>
      </div>
    </AdminLayout>
  );
};
export default ManageStudents;
