import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage.jsx'
import LoginPage from './components/LoginPage.js'
import MockInterviewPage from './components/MockInterviewPage.js'
import SignupPage from './components/SignupPage.js'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/mock-interview" element={<MockInterviewPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}

export default App
