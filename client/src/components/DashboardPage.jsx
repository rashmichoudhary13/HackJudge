import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'

// Static mock data matching the details and visual structure in the image
const STATIC_PROJECTS = [
  {
    Title: "Project1_Title",
    ProblemStatement: "The fox jumps over the lazy dog and i have been going on trip. Need a streamlined way to track urban transit carbon footprints in real-time.",
    Description: "Hello... This is summary of the project hfsdhfidshfkjdsfj ffjdsgjnfdgvkfdg jfsdfidf. An interactive dashboard mapping public transit routes and predicting carbon offset dynamically.",
    TechStack: "React, Node.js, Express, TailwindCSS",
    Feature: "Live tracking of carbon-aware transit options with route recommendations.",
    GithubUrl: "https://github.com/rashmi/project1",
    DeckUrl: "https://deck.example.com/project1",
    Score: 6,
    Summary: "Hello... This is summary of the project hfsdhfidshfkjdsfj ffjdsgjnfdgvkfdg jfsdfidf The fox jumps over the lazy dog and i have been going on trip.",
    Improvement: "Give tips to improve... show improvement here. Advice too"
  },
  {
    Title: "Project2_Title",
    ProblemStatement: "Traditional education platforms are one-size-fits-all and fail to adapt to individual learning speeds.",
    Description: "An adaptive quiz app utilizing reinforcement learning to gauge and adjust material difficulty.",
    TechStack: "Python, FastAPI, React, PostgreSQL",
    Feature: "Dynamic personalized study path generator.",
    GithubUrl: "https://github.com/rashmi/project2",
    DeckUrl: "https://deck.example.com/project2",
    Score: 8,
    Summary: "The candidate presented a robust AI-based tutor model. The design covers most accessibility standards and adapts content seamlessly.",
    Improvement: "Enhance backend latency for path generation and provide detailed onboarding explanations."
  },
  {
    Title: "Project3_Title",
    ProblemStatement: "Urban farmers struggle to optimize irrigation due to local weather unpredictability.",
    Description: "IoT soil sensors connected to a cloud forecasting engine for automated smart watering cycles.",
    TechStack: "C++, Arduino, AWS IoT Core, React",
    Feature: "Precise micro-climate forecasting metrics.",
    GithubUrl: "https://github.com/rashmi/project3",
    DeckUrl: "https://deck.example.com/project3",
    Score: 7,
    Summary: "Solid hardware-to-software implementation. Demonstrates practical application of IoT and sustainable engineering.",
    Improvement: "Implement a low-power mode for hardware nodes and design a backup physical shutoff valve."
  },
  {
    Title: "Project4_Title",
    ProblemStatement: "Crowdfunded campaigns lack clear milestone tracking, leading to donor distrust.",
    Description: "A blockchain-verified milestone release protocol where funds are locked in smart contracts.",
    TechStack: "Solidity, Ethers.js, React, TailwindCSS",
    Feature: "Zero-knowledge proof verification of deliverables.",
    GithubUrl: "https://github.com/rashmi/project4",
    DeckUrl: "https://deck.example.com/project4",
    Score: 9,
    Summary: "Innovative web3 infrastructure solving real trust issues. Excellent pitch with working smart contract demonstration.",
    Improvement: "Conduct a gas optimization audit and improve UX for non-technical users to review proofs."
  }
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [selectedIdx, setSelectedIdx] = useState(0)

  const selectedProject = STATIC_PROJECTS[selectedIdx]

  // Outer circular progress calculation
  const radius = 70
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (selectedProject.Score / 10) * circumference

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
                  {STATIC_PROJECTS.map((proj, idx) => (
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
                      <span className="truncate">{proj.Title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT SECTION (Wrapped in a big outer container box) */}
            <div className="md:col-span-8 lg:col-span-9 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md shadow-2xl shadow-violet-950/20 flex flex-col gap-6">
              
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
                      {selectedProject.Title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={selectedProject.GithubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                    <a
                      href={selectedProject.DeckUrl}
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
                      {selectedProject.ProblemStatement}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Solution Description</h3>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/30 rounded-xl p-3 border border-white/5">
                      {selectedProject.Description}
                    </p>
                  </div>
                </div>
 
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tech Stack</h3>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedProject.TechStack.split(',').map((t, i) => (
                        <span key={i} className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-300">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key Feature</h3>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/30 rounded-xl p-3 border border-white/5">
                      {selectedProject.Feature}
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
                      {selectedProject.Summary}
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
                      {selectedProject.Improvement}
                    </p>
                  </div>
 
                  {/* Start Again Action Button */}
                  <div>
                    <button
                      onClick={() => navigate('/form')}
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
                      <span className="text-5xl font-extrabold text-white tracking-tight">{selectedProject.Score}</span>
                      <span className="text-lg font-semibold text-slate-500">/10</span>
                    </div>
                  </div>
 
                  <p className="mt-6 text-xs text-slate-400 max-w-[200px]">
                    Based on Aria's innovation, feasibility, and implementation criteria
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  )
}
