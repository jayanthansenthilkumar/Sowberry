import DashboardLayout from '../../components/DashboardLayout';

const CodeEditor = () => {
  return (
    <DashboardLayout pageTitle="Code Editor" role="student">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-terminal-box-line"></i>
        </div>
        <h1>Code <span>Editor</span></h1>
        <p>Write, compile, and run code directly in your browser with our integrated development environment.</p>
      </div>
    </DashboardLayout>
  );
};
export default CodeEditor;
