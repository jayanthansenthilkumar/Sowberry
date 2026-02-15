import DashboardLayout from '../../components/DashboardLayout';

const NewCourses = () => {
  return (
    <DashboardLayout pageTitle="Courses" role="mentor">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-book-open-line"></i>
        </div>
        <h1>Manage <span>Courses</span></h1>
        <p>Create, edit, and manage your courses with curriculum builder, content uploads, and scheduling tools.</p>
      </div>
    </DashboardLayout>
  );
};
export default NewCourses;
