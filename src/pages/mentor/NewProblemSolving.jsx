import DashboardLayout from '../../components/DashboardLayout';

const NewProblemSolving = () => {
  return (
    <DashboardLayout pageTitle="Problem Solving" role="mentor">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-code-s-slash-line"></i>
        </div>
        <h1>Problem <span>Solving</span></h1>
        <p>Create and manage coding challenges, problem sets, and programming exercises for your students.</p>
      </div>
    </DashboardLayout>
  );
};
export default NewProblemSolving;
