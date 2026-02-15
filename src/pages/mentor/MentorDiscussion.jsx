import DashboardLayout from '../../components/DashboardLayout';

const MentorDiscussion = () => {
  return (
    <DashboardLayout pageTitle="Discussion" role="mentor">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-discuss-line"></i>
        </div>
        <h1>Discussion <span>Forum</span></h1>
        <p>Engage with students through discussion threads, Q&A sessions, and collaborative learning conversations.</p>
      </div>
    </DashboardLayout>
  );
};
export default MentorDiscussion;
