import DashboardLayout from '../../components/DashboardLayout';

const StudentsProgress = () => {
  return (
    <DashboardLayout pageTitle="Student Progress" role="mentor">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-line-chart-line"></i>
        </div>
        <h1>Student <span>Progress</span></h1>
        <p>Monitor individual and class-wide student progress with detailed analytics and performance reports.</p>
      </div>
    </DashboardLayout>
  );
};
export default StudentsProgress;
