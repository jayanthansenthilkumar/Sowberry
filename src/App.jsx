import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <Router basename="/Sowberry">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/system-reports" element={<SystemReports />} />
        <Route path="/admin/performance-analytics" element={<PerformanceAnalytics />} />
        <Route path="/admin/manage-students" element={<ManageStudents />} />
        <Route path="/admin/courses-overview" element={<CoursesOverview />} />
        <Route path="/admin/manage-mentors" element={<ManageMentors />} />
        
        {/* Mentor Routes */}
        <Route path="/mentor" element={<MentorDashboard />} />
        <Route path="/mentor/new-courses" element={<NewCourses />} />
        <Route path="/mentor/new-problem-solving" element={<NewProblemSolving />} />
        <Route path="/mentor/students-progress" element={<StudentsProgress />} />
        <Route path="/mentor/new-events" element={<NewEvents />} />
        <Route path="/mentor/new-aptitude" element={<NewAptitude />} />
        <Route path="/mentor/new-assignments" element={<NewAssignments />} />
        <Route path="/mentor/discussion" element={<MentorDiscussion />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/learning-games" element={<LearningGames />} />
        <Route path="/student/study-material" element={<StudyMaterial />} />
        <Route path="/student/my-courses" element={<MyCourses />} />
        <Route path="/student/coding-practice" element={<CodingPractice />} />
        <Route path="/student/aptitude-tests" element={<AptitudeTests />} />
        <Route path="/student/code-editor" element={<CodeEditor />} />
        <Route path="/student/my-assignments" element={<MyAssignments />} />
        <Route path="/student/my-grades" element={<MyGrades />} />
        <Route path="/student/my-progress" element={<MyProgress />} />
      </Routes>
    </Router>
  )
}

export default App
