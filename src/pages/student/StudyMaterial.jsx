import DashboardLayout from '../../components/DashboardLayout';

const StudyMaterial = () => {
  return (
    <DashboardLayout pageTitle="Study Material" role="student">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-file-text-line"></i>
        </div>
        <h1>Study <span>Material</span></h1>
        <p>Access comprehensive study resources, notes, reference guides, and downloadable learning materials.</p>
      </div>
    </DashboardLayout>
  );
};
export default StudyMaterial;
