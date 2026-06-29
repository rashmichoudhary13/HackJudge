import { Routes, Route } from 'react-router-dom'
import DashboardPage from './components/DashboardPage.jsx'
import LandingPage from './components/LandingPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import InterviewRoomPage from './components/InterviewRoomPage.jsx'
import MockInterviewPage from './components/MockInterviewPage.jsx'
import SignupPage from './components/SignupPage.jsx'
import ProcessingPage from './components/processingPage.jsx'
import QuestionProcessingPage from './components/QuestionLoading.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/form" element={<MockInterviewPage />} />
      <Route path="/mock-interview" element={<MockInterviewPage />} />
      <Route path="/interview-room" element={<InterviewRoomPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/processing" element={<ProcessingPage/>}/>
      <Route path="/interview-processing" element={<QuestionProcessingPage/>}/>
    </Routes>
  )
}

export default App
