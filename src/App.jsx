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
import NewCourses from './pages/mentor/NewCourses'
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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen bg-cream dark-theme:bg-gray-950"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/auth" replace />;
  return children;
};

function App() {
  return (
    <Router basename="/">
      <AuthProvider>
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
          
          {/* Mentor Routes */}
          <Route path="/mentor" element={<ProtectedRoute allowedRoles={['mentor']}><MentorDashboard /></ProtectedRoute>} />
          <Route path="/mentor/new-courses" element={<ProtectedRoute allowedRoles={['mentor']}><NewCourses /></ProtectedRoute>} />
          <Route path="/mentor/new-problem-solving" element={<ProtectedRoute allowedRoles={['mentor']}><NewProblemSolving /></ProtectedRoute>} />
          <Route path="/mentor/students-progress" element={<ProtectedRoute allowedRoles={['mentor']}><StudentsProgress /></ProtectedRoute>} />
          <Route path="/mentor/new-events" element={<ProtectedRoute allowedRoles={['mentor']}><NewEvents /></ProtectedRoute>} />
          <Route path="/mentor/new-aptitude" element={<ProtectedRoute allowedRoles={['mentor']}><NewAptitude /></ProtectedRoute>} />
          <Route path="/mentor/new-assignments" element={<ProtectedRoute allowedRoles={['mentor']}><NewAssignments /></ProtectedRoute>} />
          <Route path="/mentor/discussion" element={<ProtectedRoute allowedRoles={['mentor']}><MentorDiscussion /></ProtectedRoute>} />
          
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
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
