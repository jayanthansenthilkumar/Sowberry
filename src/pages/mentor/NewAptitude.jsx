import DashboardLayout from '../../components/DashboardLayout';

const NewAptitude = () => {
  return (
    <DashboardLayout pageTitle="Aptitude" role="mentor">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-question-answer-line"></i>
        </div>
        <h1>Aptitude <span>Management</span></h1>
        <p>Create aptitude tests, set question banks, configure scoring, and review student test results.</p>
      </div>
    </DashboardLayout>
  );
};
export default NewAptitude;
