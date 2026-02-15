import DashboardLayout from '../../components/DashboardLayout';

const MyAssignments = () => {
  return (
    <DashboardLayout pageTitle="My Assignments" role="student">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-task-line"></i>
        </div>
        <h1>My <span>Assignments</span></h1>
        <p>View, submit, and track your assignments with deadlines, feedback, and grading status.</p>
      </div>
    </DashboardLayout>
  );
};
export default MyAssignments;
