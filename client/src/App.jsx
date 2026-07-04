import { Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import InterviewRoomPage from './components/InterviewRoomPage.jsx'
import MockInterviewPage from './pages/MockInterviewPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ProcessingPage from './components/processingPage.jsx'
import QuestionProcessingPage from './components/QuestionLoading.jsx'
import { ProtectedRoute, InterviewProtectedRoute } from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/form" element={<MockInterviewPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Interview Flow Routes (requires both Login & Form Submission) */}
      <Route path="/interview-room" element={<InterviewProtectedRoute><InterviewRoomPage /></InterviewProtectedRoute>} />
      <Route path="/processing" element={<InterviewProtectedRoute><ProcessingPage /></InterviewProtectedRoute>} />
      <Route path="/interview-processing" element={<InterviewProtectedRoute><QuestionProcessingPage /></InterviewProtectedRoute>} />
    </Routes>
  )
}

export default App
