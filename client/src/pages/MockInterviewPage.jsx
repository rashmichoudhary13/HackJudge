import { motion } from 'framer-motion'
import Footer from '../components/Footer.jsx'
import MockInterviewForm from '../components/MockInterviewForm.jsx'
import Navbar from '../components/Navbar.jsx'
import { useLocation } from 'react-router-dom'

export default function MockInterviewPage() {

  const location = useLocation();
  const error = location.state?.error || null;
  
  return (
    <motion.div
      className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white text-slate-800 antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Navbar />

      <main className="relative flex flex-1 items-start justify-center px-4 py-12 sm:px-6 md:py-16">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.1),transparent)]"
          aria-hidden
        />
        <motion.div
          className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
        >
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Project details
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Tell the AI judge about your hackathon project. You can refine this
            before the session starts.
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm font-semibold text-rose-800">
              ⚠️ {error}
            </div>
          )}

          <MockInterviewForm className="mt-8" />
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  )
}
