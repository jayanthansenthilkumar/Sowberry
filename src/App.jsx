import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import AuthPage from './pages/auth/AuthPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSettings from './pages/admin/AdminSettings'
import SystemReports from './pages/admin/SystemReports'
import PerformanceAnalytics from './pages/admin/PerformanceAnalytics'
import ManageStudents from './pages/admin/ManageStudents'
import CoursesOverview from './pages/admin/CoursesOverview'
import ManageMentors from './pages/admin/ManageMentors'
import MentorDashboard from './pages/mentor/MentorDashboard'
import MentorDoubts from './pages/mentor/Doubts'
import NewProblemSolving from './pages/mentor/NewProblemSolving'
import StudentsProgress from './pages/mentor/StudentsProgress'
import NewEvents from './pages/mentor/NewEvents'
import NewAptitude from './pages/mentor/NewAptitude'
import NewAssignments from './pages/mentor/NewAssignments'
import MentorDiscussion from './pages/mentor/MentorDiscussion'
import StudentDashboard from './pages/student/StudentDashboard'
import LearningGames from './pages/student/LearningGames'
import StudyMaterial from './pages/student/StudyMaterial'
import MyCourses from './pages/student/MyCourses'
import CodingPractice from './pages/student/CodingPractice'
import AptitudeTests from './pages/student/AptitudeTests'
import CodeEditor from './pages/student/CodeEditor'
import MyAssignments from './pages/student/MyAssignments'
import MyGrades from './pages/student/MyGrades'
import MyProgress from './pages/student/MyProgress'
import CourseViewer from './pages/student/CourseViewer'
import MyDoubts from './pages/student/MyDoubts'
import SessionManager from './components/SessionManager'

// Error Boundary to catch runtime errors and show a visible message
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('React Error Boundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto' }}>
          <h1 style={{ color: '#c96442', fontSize: '24px', marginBottom: '16px' }}>Something went wrong</h1>
          <p style={{ color: '#666', marginBottom: '12px' }}>The application encountered an error. Please try refreshing the page.</p>
          <pre style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', fontSize: '13px', overflow: 'auto', color: '#333' }}>
            {this.state.error?.message || 'Unknown error'}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '10px 24px', background: '#c96442', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen bg-cream dark-theme:bg-gray-950"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/auth" replace />;
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Router basename="/">
        <AuthProvider>
          <SessionManager />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
          <Route path="/admin/system-reports" element={<ProtectedRoute allowedRoles={['admin']}><SystemReports /></ProtectedRoute>} />
          <Route path="/admin/performance-analytics" element={<ProtectedRoute allowedRoles={['admin']}><PerformanceAnalytics /></ProtectedRoute>} />
          <Route path="/admin/manage-students" element={<ProtectedRoute allowedRoles={['admin']}><ManageStudents /></ProtectedRoute>} />
          <Route path="/admin/courses-overview" element={<ProtectedRoute allowedRoles={['admin']}><CoursesOverview /></ProtectedRoute>} />
          <Route path="/admin/manage-mentors" element={<ProtectedRoute allowedRoles={['admin']}><ManageMentors /></ProtectedRoute>} />
          
          {/* Mentor Routes (accessible by mentor + admin) */}
          <Route path="/mentor" element={<ProtectedRoute allowedRoles={['mentor', 'admin']}><MentorDashboard /></ProtectedRoute>} />
          <Route path="/mentor/doubts" element={<ProtectedRoute allowedRoles={['mentor', 'admin']}><MentorDoubts /></ProtectedRoute>} />
          <Route path="/mentor/students-progress" element={<ProtectedRoute allowedRoles={['mentor', 'admin']}><StudentsProgress /></ProtectedRoute>} />
          <Route path="/mentor/new-assignments" element={<ProtectedRoute allowedRoles={['mentor', 'admin']}><NewAssignments /></ProtectedRoute>} />
          
          {/* Admin-only Content Management (moved from mentor) */}
          <Route path="/admin/problem-solving" element={<ProtectedRoute allowedRoles={['admin']}><NewProblemSolving /></ProtectedRoute>} />
          <Route path="/admin/aptitude" element={<ProtectedRoute allowedRoles={['admin']}><NewAptitude /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['admin']}><NewEvents /></ProtectedRoute>} />
          <Route path="/admin/discussion" element={<ProtectedRoute allowedRoles={['admin']}><MentorDiscussion /></ProtectedRoute>} />
          
          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/learning-games" element={<ProtectedRoute allowedRoles={['student']}><LearningGames /></ProtectedRoute>} />
          <Route path="/student/study-material" element={<ProtectedRoute allowedRoles={['student']}><StudyMaterial /></ProtectedRoute>} />
          <Route path="/student/my-courses" element={<ProtectedRoute allowedRoles={['student']}><MyCourses /></ProtectedRoute>} />
          <Route path="/student/coding-practice" element={<ProtectedRoute allowedRoles={['student']}><CodingPractice /></ProtectedRoute>} />
          <Route path="/student/aptitude-tests" element={<ProtectedRoute allowedRoles={['student']}><AptitudeTests /></ProtectedRoute>} />
          <Route path="/student/code-editor" element={<ProtectedRoute allowedRoles={['student']}><CodeEditor /></ProtectedRoute>} />
          <Route path="/student/my-assignments" element={<ProtectedRoute allowedRoles={['student']}><MyAssignments /></ProtectedRoute>} />
          <Route path="/student/my-grades" element={<ProtectedRoute allowedRoles={['student']}><MyGrades /></ProtectedRoute>} />
          <Route path="/student/my-progress" element={<ProtectedRoute allowedRoles={['student']}><MyProgress /></ProtectedRoute>} />
          <Route path="/student/my-doubts" element={<ProtectedRoute allowedRoles={['student']}><MyDoubts /></ProtectedRoute>} />
          <Route path="/student/course-viewer/:id" element={<ProtectedRoute allowedRoles={['student']}><CourseViewer /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  )
}

export default App
