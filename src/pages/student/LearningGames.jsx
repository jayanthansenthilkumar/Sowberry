import DashboardLayout from '../../components/DashboardLayout';

const LearningGames = () => {
  return (
    <DashboardLayout pageTitle="Learning Games" role="student">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-gamepad-line"></i>
        </div>
        <h1>Learning <span>Games</span></h1>
        <p>Make learning fun with interactive educational games designed to reinforce concepts and boost retention.</p>
      </div>
    </DashboardLayout>
  );
};
export default LearningGames;
