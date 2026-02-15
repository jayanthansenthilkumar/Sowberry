import AdminLayout from '../../components/AdminLayout';


const CoursesOverview = () => {
  return (
    <AdminLayout pageTitle="Courses Overview">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-book-open-line"></i>
        </div>
        <h1>Courses <span>Overview</span></h1>
        <p>View and manage all courses across the platform, monitor enrollment, and review course performance metrics.</p>
      </div>
    </AdminLayout>
  );
};
export default CoursesOverview;
