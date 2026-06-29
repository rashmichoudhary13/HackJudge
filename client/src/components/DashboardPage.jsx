import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'


export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const userId = location.state?.userId || ""

  const [selectedIdx, setSelectedIdx] = useState(0)
  const [project, setProjects] = useState([]);

  const selectedProject = project[selectedIdx]

  // Outer circular progress calculation
  const radius = 70
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius

  const score = selectedProject?.feedback.score ?? 0
  const strokeDashoffset = circumference - (score / 10) * circumference

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/${userId}/summary`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          console.log("Error in generating summary")
        }

        const data = await response.json();
        console.log("dashboard Data: ", data);
        console.log("Techstack: ", data[0].project.TechStack);
        setProjects(data);
      } catch (err) {
        console.log("Error in fetching summary: ", err);
      }
    }

    fetchSummary();
  }, [])

  const handleStartButton = () => {
    navigate('/interview-processing', {
      state: {
        projectId: selectedProject.feedback.projectId,
        projectTitle: selectedProject.project.Title
      }
    })
  }

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 text-slate-100 antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Navbar />

      <main className="relative flex flex-1 items-start justify-center px-4 py-8 sm:px-6 md:py-12">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.25),transparent)]"
          aria-hidden
        />

        <div className="relative w-full max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">

            {/* LEFT SIDEBAR (No Details Changed, matching the image completely, styled premiumly) */}
            <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md shadow-2xl shadow-violet-950/20 md:col-span-4 lg:col-span-3">
              {/* User Profile */}
              <div className="flex flex-col items-center gap-3 text-center">
                {/* Profile Placeholder from Image */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-white/10 text-white shadow-lg">
                  <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-white">
                    Rashmi
                  </h2>
                  <p className="truncate text-xs text-slate-400">
                    xyz@gmail.com
                  </p>
                </div>
              </div>

              <hr className="border-white/10" />

              {/* Projects Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Projects &gt;
                  </span>
                  <button
                    onClick={() => navigate('/form')}
                    className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-semibold text-violet-400 hover:bg-violet-500/20 hover:text-violet-300 transition cursor-pointer"
                  >
                    + New
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                  {project.map((proj, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedIdx(idx)}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition text-left cursor-pointer ${selectedIdx === idx
                        ? 'border-violet-500/30 bg-violet-500/10 text-violet-200 shadow-md shadow-violet-950/30'
                        : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                    >
                      <svg className={`h-4 w-4 shrink-0 ${selectedIdx === idx ? 'text-violet-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span className="truncate">{selectedProject?.project.Title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT SECTION (Wrapped in a big outer container box) */}
            <div className="md:col-span-8 lg:col-span-9 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md shadow-2xl shadow-violet-950/20 flex flex-col gap-6">

              {project.length > 0 ? (
                <>
                  {/* Project Details Panel */}
                  <motion.div
                    key={`details-${selectedIdx}`}
                    className="rounded-xl border border-white/5 bg-slate-950/30 p-5 shadow-inner"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">Project Details</span>
                        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                          {selectedProject?.project.Title}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={selectedProject?.project.DeckUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Deck
                        </a>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Problem Statement</h3>
                        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/30 rounded-xl p-3 border border-white/5">
                          {selectedProject?.project.ProblemStatement}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Solution Description</h3>
                        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/30 rounded-xl p-3 border border-white/5">
                          {selectedProject?.project.Description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tech Stack</h3>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {selectedProject?.project.TechStack && (
                            <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-300">
                              {selectedProject.project.TechStack}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key Feature</h3>
                        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/30 rounded-xl p-3 border border-white/5">
                          {selectedProject?.project.Feature}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Evaluation Details */}
                  <motion.div
                    key={`eval-${selectedIdx}`}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Summary & Improvements - 2 cols */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                      {/* Summary Card */}
                      <div className="rounded-xl border border-white/5 bg-slate-950/30 p-5 shadow-inner">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-400 flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          Summary:
                        </h3>
                        <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
                          {selectedProject?.feedback.summary}
                        </p>
                      </div>

                      {/* Improvement Card */}
                      <div className="rounded-xl border border-white/5 bg-slate-950/30 p-5 shadow-inner">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-400 flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          Improvement:
                        </h3>
                        <p className="mt-2.5 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                          {selectedProject?.feedback.improvement}
                        </p>
                      </div>

                      {/* Start Again Action Button */}
                      <div>
                        <button
                          onClick={handleStartButton}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 cursor-pointer"
                        >
                          Start Again
                        </button>
                      </div>
                    </div>

                    {/* Score Ring Card - 1 col */}
                    <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-slate-950/30 p-6 text-center shadow-inner">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">
                        Score:
                      </h3>

                      {/* Circular progress gauge matching the double rings of the image */}
                      <div className="relative flex items-center justify-center h-48 w-48">
                        {/* Outer decorative ring */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="85"
                            className="text-slate-800/40"
                            strokeWidth="1"
                            stroke="currentColor"
                            fill="transparent"
                          />
                          {/* Track ring */}
                          <circle
                            cx="96"
                            cy="96"
                            r="70"
                            className="text-slate-800/80"
                            strokeWidth={strokeWidth}
                            stroke="currentColor"
                            fill="transparent"
                          />
                          {/* Active progress ring */}
                          <motion.circle
                            cx="96"
                            cy="96"
                            r={radius}
                            className="text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: strokeDashoffset }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                          />
                        </svg>
                        <div className="text-center z-10 flex items-baseline justify-center">
                          <span className="text-5xl font-extrabold text-white tracking-tight">{selectedProject?.feedback.score}</span>
                        </div>
                      </div>

                      <p className="mt-6 text-xs text-slate-400 max-w-[200px]">
                        Based on Aria's innovation, feasibility, and implementation criteria
                      </p>
                    </div>
                  </motion.div>
                </>
              ) : (
                <div className="rounded-xl border border-white/5 bg-slate-950/30 p-5 shadow-inner h-60 flex justify-center items-center" >
                  <p className="text-lg font-semibold uppercase tracking-wider text-violet-400 ">No Projects yet</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  )
}
