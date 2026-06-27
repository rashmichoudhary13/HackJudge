import { motion } from 'framer-motion'
import Footer from './Footer.jsx'
import MockInterviewForm from './MockInterviewForm.jsx'
import Navbar from './Navbar.jsx'

export default function MockInterviewPage() {
  return (
    <motion.div
      className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 text-slate-100 antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Navbar />

      <main className="relative flex flex-1 items-start justify-center px-4 py-12 sm:px-6 md:py-16">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
          aria-hidden
        />
        <motion.div
          className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-2xl shadow-violet-950/40 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
        >
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Project details
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Tell the AI judge about your hackathon project. You can refine this
            before the session starts.
          </p>
          <MockInterviewForm className="mt-8" />
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  )
}
