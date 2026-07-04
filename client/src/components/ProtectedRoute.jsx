import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth.jsx'

export function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <span className="text-sm font-medium">Checking session...</span>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function InterviewProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <span className="text-sm font-medium">Checking session...</span>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // Check if form was submitted by verifying location state.
  // For /interview-processing, we need location.state?.projectId.
  // For /interview-room, we need location.state?.interviewId.
  // For /processing, we need location.state?.interviewId.
  const projectId = location.state?.projectId
  const interviewId = location.state?.interviewId

  if (!projectId && !interviewId) {
    return <Navigate to="/form" replace state={{ error: "Please submit the project details form first." }} />
  }

  return children
}
