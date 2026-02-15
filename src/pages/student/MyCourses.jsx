import DashboardLayout from '../../components/DashboardLayout';

const MyCourses = () => {
  return (
    <DashboardLayout pageTitle="My Courses" role="student">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-book-open-line"></i>
        </div>
        <h1>My <span>Courses</span></h1>
        <p>Browse and manage your enrolled courses, track completion, and access learning materials all in one place.</p>
      </div>
    </DashboardLayout>
  );
};
export default MyCourses;
