import DashboardLayout from '../../components/DashboardLayout';

const MyGrades = () => {
  return (
    <DashboardLayout pageTitle="My Grades" role="student">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-bar-chart-box-line"></i>
        </div>
        <h1>My <span>Grades</span></h1>
        <p>Review your grades, scores, and detailed performance breakdowns across all courses and assessments.</p>
      </div>
    </DashboardLayout>
  );
};
export default MyGrades;
