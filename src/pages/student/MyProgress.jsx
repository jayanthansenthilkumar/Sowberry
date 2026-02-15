import DashboardLayout from '../../components/DashboardLayout';

const MyProgress = () => {
  return (
    <DashboardLayout pageTitle="My Progress" role="student">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-line-chart-line"></i>
        </div>
        <h1>My <span>Progress</span></h1>
        <p>Track your learning journey with visual progress indicators, milestones achieved, and areas for improvement.</p>
      </div>
    </DashboardLayout>
  );
};
export default MyProgress;
