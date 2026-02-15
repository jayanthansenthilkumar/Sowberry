import DashboardLayout from '../../components/DashboardLayout';

const NewAssignments = () => {
  return (
    <DashboardLayout pageTitle="Assignments" role="mentor">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <i className="ri-task-line text-4xl text-primary"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark-theme:text-white mb-3">Manage <span className="text-gradient">Assignments</span></h1>
        <p className="text-gray-500 dark-theme:text-gray-400 max-w-md">Create assignments, set deadlines, review submissions, and provide feedback to your students.</p>
      </div>
    </DashboardLayout>
  );
};
export default NewAssignments;
