import DashboardLayout from '../../components/DashboardLayout';

const NewEvents = () => {
  return (
    <DashboardLayout pageTitle="Events" role="mentor">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-calendar-event-line"></i>
        </div>
        <h1>Manage <span>Events</span></h1>
        <p>Schedule and manage live sessions, webinars, workshops, and other educational events for your students.</p>
      </div>
    </DashboardLayout>
  );
};
export default NewEvents;
