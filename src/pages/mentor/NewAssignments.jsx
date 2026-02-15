import DashboardLayout from '../../components/DashboardLayout';

const NewAssignments = () => {
  return (
    <DashboardLayout pageTitle="Assignments" role="mentor">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-task-line"></i>
        </div>
        <h1>Manage <span>Assignments</span></h1>
        <p>Create assignments, set deadlines, review submissions, and provide feedback to your students.</p>
      </div>
    </DashboardLayout>
  );
};
export default NewAssignments;
