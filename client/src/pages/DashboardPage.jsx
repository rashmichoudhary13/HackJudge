import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { auth } from '../context/firebase.js'
import { ImUserTie } from "react-icons/im";
import { HiOutlineTrash } from "react-icons/hi2";
import Loader from '../components/Loader.jsx'
import { AlertTriangle, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'


export default function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const user = auth.currentUser;
  const userId = user?.uid;

  const userName = user?.displayName?.split(' ')[0] || "User";
  const userEmail = user?.email || "email.com";

  const [selectedIdx, setSelectedIdx] = useState(0)
  const [project, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAttemptIdx, setSelectedAttemptIdx] = useState(0)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const selectedProject = project[selectedIdx]

  const currentFeedback = selectedProject?.feedback?.length === 1
    ? selectedProject.feedback[0]
    : selectedProject?.feedback?.[selectedAttemptIdx]

  const conversation = selectedProject?.feedback?.length === 1 ?
    selectedProject.feedback[0].conversation
    : selectedProject?.feedback?.[selectedAttemptIdx].conversation

  useEffect(() => {
    const errorFromState = location.state?.interviewError;
    if (errorFromState) {
      setTimeout(() => {
        setErrorMessage(errorFromState);
        setShowErrorModal(true);
      }, 0);

      // Clear the state so refreshing doesn't show the error again
      navigate(location.pathname, { replace: true, state: { ...location.state, interviewError: undefined } });
    }
  }, [location.state, navigate, location.pathname]);

  // Outer circular progress calculation
  const radius = 70
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius

  const problemScore = currentFeedback?.categoryfeedback?.problem?.score ?? 0
  const solutionScore = currentFeedback?.categoryfeedback?.solution?.score ?? 0
  const innovationScore = currentFeedback?.categoryfeedback?.innovation?.score ?? 0
  const score = Math.round((problemScore + solutionScore + innovationScore) / 3)
  const strokeDashoffset = circumference - (score / 10) * circumference

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
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
        setProjects(data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [userId])

  const handleStartButton = () => {
    navigate('/interview-processing', {
      state: {
        projectId: selectedProject.projectId,
        projectTitle: selectedProject.project.Title
      }
    })
  }

  const handleDelete = async () => {
    try {
      const projectId = selectedProject?.projectId;
      if (!projectId) return;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.error("Can't delete the project");
      }

      const result = await response.json();

      const filteredProject = project.filter((item) => item.projectId !== selectedProject.projectId);
      setProjects(filteredProject);
      setSelectedIdx(0);
    } catch (err) {
      console.error("Error deleting a project: ", err);
    }
  }

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white text-slate-800 antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Navbar />

      <main className="relative flex flex-1 items-start justify-center px-4 py-8 sm:px-6 md:py-5">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.1),transparent)]"
          aria-hidden
        />

        <div className="relative w-full">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">

            {/* LEFT SIDEBAR (No Details Changed, matching the image completely, styled premiumly) */}
            <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 backdrop-blur-md shadow-xl shadow-slate-100/80 md:col-span-4 lg:col-span-3">
              {/* User Profile */}
              <div className="flex flex-col items-center gap-3 text-center">
                {/* Profile Placeholder from Image */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-650 shadow-sm">
                  <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-slate-900">
                    {userName}
                  </h2>
                  <p className="truncate text-xs text-slate-500">
                    {userEmail}
                  </p>
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* Projects Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Projects &gt;
                  </span>
                  <button
                    onClick={() => navigate('/form')}
                    className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-650 hover:bg-violet-100 transition cursor-pointer"
                  >
                    + New
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-[590px] overflow-y-auto pr-1">
                  {project.map((proj, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedIdx(idx)
                        setSelectedAttemptIdx(0)
                      }}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition text-left cursor-pointer ${selectedIdx === idx
                        ? 'border-violet-200 bg-violet-50 text-violet-750 shadow-sm shadow-violet-100/50'
                        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      <svg className={`h-4 w-4 shrink-0 ${selectedIdx === idx ? 'text-violet-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span className="truncate">{proj.project.Title}</span>

                      <div onClick={handleDelete} className='ml-auto cursor-pointer hover:bg-red-200 w-5 h-5 rounded-xl'> <HiOutlineTrash className='text-red-500 mx-auto my-auto' /> </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT SECTION (Wrapped in a big outer container box) */}
            <div className="md:col-span-8 lg:col-span-9 rounded-2xl border border-slate-200 bg-white p-6 backdrop-blur-md shadow-xl shadow-slate-100/80 flex flex-col gap-6">

              {project.length > 0 ? (
                <>
                  {/* Project Details Panel */}
                  <motion.div
                    key={`details-${selectedIdx}`}
                    className="rounded-xl border border-slate-150 bg-slate-50/50 p-5 shadow-sm"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-600">Project Details</span>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                          {selectedProject?.project.Title}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">

                        <div
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition shadow-sm" >
                          <ImUserTie />
                          {selectedProject?.project.judgeType} Judge
                        </div>

                        <a
                          href={selectedProject?.project.DeckUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition shadow-sm"
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
                        <p className="text-sm text-slate-700 leading-relaxed bg-white rounded-xl p-3 border border-slate-150 shadow-sm">
                          {selectedProject?.project.ProblemStatement}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Solution Description</h3>
                        <p className="text-sm text-slate-700 leading-relaxed bg-white rounded-xl p-3 border border-slate-150 shadow-sm">
                          {selectedProject?.project.Description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2 pt-1.5">
                          {selectedProject?.project.TechStack &&
                            selectedProject.project.TechStack.split(',').map((tech, idx) => {
                              const trimmed = tech.trim();
                              if (!trimmed) return null;
                              return (
                                <span key={idx} className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm transition-all hover:bg-indigo-100/60 hover:scale-[1.02] cursor-default">
                                  {trimmed}
                                </span>
                              )
                            })
                          }
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key Feature</h3>
                        <p className="text-sm text-slate-700 leading-relaxed bg-white rounded-xl p-3 border border-slate-150 shadow-sm">
                          {selectedProject?.project.Feature}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {
                    selectedProject?.feedback.length == 0 && (
                      <div className="flex items-center">
                        <button
                          onClick={handleStartButton}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 cursor-pointer"
                        >
                          Start Again
                        </button>

                        <button
                          onClick={handleDelete}
                          className="ml-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    )
                  }
                  {/* Evaluation Details */}
                  {
                    selectedProject?.feedback && selectedProject.feedback.length > 0 && (
                      <div className="flex flex-col gap-6">

                        {/* Horizontal Attempts Bar (only shown if feedback.length > 1) */}
                        {selectedProject.feedback.length > 1 && (
                          <div className="rounded-xl border border-slate-150 bg-slate-50/50 p-4 shadow-sm flex flex-col gap-2.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Select Attempt
                            </span>
                            <div className="flex flex-row gap-3 overflow-x-auto pb-1">
                              {selectedProject.feedback.map((attempt, index) => {
                                const attemptScore = Math.round(
                                  ((attempt?.categoryfeedback?.problem?.score ?? 0) +
                                    (attempt?.categoryfeedback?.solution?.score ?? 0) +
                                    (attempt?.categoryfeedback?.innovation?.score ?? 0)) / 3
                                );
                                return (
                                  <button
                                    key={index}
                                    onClick={() => setSelectedAttemptIdx(index)}
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-medium transition cursor-pointer shrink-0 ${selectedAttemptIdx === index
                                      ? 'border-violet-200 bg-violet-50 text-violet-750 shadow-sm shadow-violet-100/50'
                                      : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50 hover:text-slate-905'
                                      }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold">Attempt {index + 1}</span>
                                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${selectedAttemptIdx === index
                                        ? 'bg-violet-100 text-violet-850'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        Score: {attemptScore}
                                      </span>
                                    </div>
                                    <svg
                                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${selectedAttemptIdx === index ? 'text-violet-600 scale-110' : 'text-slate-400'
                                        }`}
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                    </svg>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Content Grid */}
                        <motion.div
                          key={`eval-${selectedIdx}-${selectedAttemptIdx}`}
                          className="flex flex-col gap-8"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Summary & Overall Score Row */}
                          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Conversation Summary Card */}
                            <div className="rounded-xl border border-slate-150 bg-slate-50/50 p-5 shadow-sm flex flex-col justify-between lg:col-span-2">
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-655 flex items-center gap-2">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  </svg>
                                  Conversation Summary:
                                </h3>
                                <p className="mt-3.5 text-sm text-slate-700 leading-relaxed">
                                  {currentFeedback?.convosummary || "No summary available for this attempt."}
                                </p>
                              </div>
                            </div>

                            {/* Score Ring Card - 1 col */}
                            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-150 bg-slate-50/50 p-6 text-center shadow-sm">
                              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6">
                                Score:
                              </h3>

                              {/* Circular progress gauge */}
                              <div className="relative flex items-center justify-center h-48 w-48">
                                {/* Outer decorative ring */}
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                  <circle
                                    cx="96"
                                    cy="96"
                                    r="85"
                                    className="text-slate-200"
                                    strokeWidth="1"
                                    stroke="currentColor"
                                    fill="transparent"
                                  />
                                  {/* Track ring */}
                                  <circle
                                    cx="96"
                                    cy="96"
                                    r="70"
                                    className="text-slate-100"
                                    strokeWidth={strokeWidth}
                                    stroke="currentColor"
                                    fill="transparent"
                                  />
                                  {/* Active progress ring */}
                                  <motion.circle
                                    cx="96"
                                    cy="96"
                                    r={radius}
                                    className="text-violet-600 drop-shadow-[0_0_8px_rgba(139,92,246,0.2)]"
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
                                  <span className="text-5xl font-extrabold text-slate-900 tracking-tight">{score}</span>
                                </div>
                              </div>

                              <p className="mt-6 text-xs text-slate-500 max-w-[200px]">
                                Calculated average score out of 10 across all judging criteria
                              </p>
                            </div>
                          </div>

                          {/* Category Rubrics (Detailed Scoring) */}
                          <div className="flex flex-col gap-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Category Rubrics
                            </h3>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                              {/* Problem Understanding Card */}
                              <div className="rounded-xl border border-slate-150 bg-slate-50/50 p-5 shadow-sm flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                    <h4 className="text-sm font-bold text-slate-800">Problem Understanding</h4>
                                    <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-850">
                                      {currentFeedback?.categoryfeedback?.problem?.score ?? 0}/10
                                    </span>
                                  </div>

                                  {/* Strengths */}
                                  <div className="mt-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-green-600 flex items-center gap-1.5">
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                      Strengths
                                    </span>
                                    <ul className="mt-2 space-y-1">
                                      {(currentFeedback?.categoryfeedback?.problem?.strength ? currentFeedback.categoryfeedback.problem.strength.split(', ') : []).map((str, idx) => (
                                        <li key={idx} className="text-xs text-slate-655 list-disc list-inside leading-relaxed">
                                          {str}
                                        </li>
                                      ))}
                                      {!(currentFeedback?.categoryfeedback?.problem?.strength) && (
                                        <li className="text-xs text-slate-400 italic">No specific strengths noted.</li>
                                      )}
                                    </ul>
                                  </div>

                                  {/* Weaknesses */}
                                  <div className="mt-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                      Weaknesses
                                    </span>
                                    <ul className="mt-2 space-y-1">
                                      {(currentFeedback?.categoryfeedback?.problem?.weakness ? currentFeedback.categoryfeedback.problem.weakness.split(', ') : []).map((wk, idx) => (
                                        <li key={idx} className="text-xs text-slate-655 list-disc list-inside leading-relaxed">
                                          {wk}
                                        </li>
                                      ))}
                                      {!(currentFeedback?.categoryfeedback?.problem?.weakness) && (
                                        <li className="text-xs text-slate-400 italic">No specific weaknesses noted.</li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              {/* Solution Clarity Card */}
                              <div className="rounded-xl border border-slate-150 bg-slate-50/50 p-5 shadow-sm flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                    <h4 className="text-sm font-bold text-slate-800">Solution Clarity</h4>
                                    <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-850">
                                      {currentFeedback?.categoryfeedback?.solution?.score ?? 0}/10
                                    </span>
                                  </div>

                                  {/* Strengths */}
                                  <div className="mt-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-green-600 flex items-center gap-1.5">
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                      Strengths
                                    </span>
                                    <ul className="mt-2 space-y-1">
                                      {(currentFeedback?.categoryfeedback?.solution?.strength ? currentFeedback.categoryfeedback.solution.strength.split(', ') : []).map((str, idx) => (
                                        <li key={idx} className="text-xs text-slate-655 list-disc list-inside leading-relaxed">
                                          {str}
                                        </li>
                                      ))}
                                      {!(currentFeedback?.categoryfeedback?.solution?.strength) && (
                                        <li className="text-xs text-slate-400 italic">No specific strengths noted.</li>
                                      )}
                                    </ul>
                                  </div>

                                  {/* Weaknesses */}
                                  <div className="mt-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                      Weaknesses
                                    </span>
                                    <ul className="mt-2 space-y-1">
                                      {(currentFeedback?.categoryfeedback?.solution?.weakness ? currentFeedback.categoryfeedback.solution.weakness.split(', ') : []).map((wk, idx) => (
                                        <li key={idx} className="text-xs text-slate-655 list-disc list-inside leading-relaxed">
                                          {wk}
                                        </li>
                                      ))}
                                      {!(currentFeedback?.categoryfeedback?.solution?.weakness) && (
                                        <li className="text-xs text-slate-400 italic">No specific weaknesses noted.</li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              {/* Innovation Card */}
                              <div className="rounded-xl border border-slate-150 bg-slate-50/50 p-5 shadow-sm flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                    <h4 className="text-sm font-bold text-slate-800">Innovation</h4>
                                    <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-850">
                                      {currentFeedback?.categoryfeedback?.innovation?.score ?? 0}/10
                                    </span>
                                  </div>

                                  {/* Strengths */}
                                  <div className="mt-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-green-600 flex items-center gap-1.5">
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                      Strengths
                                    </span>
                                    <ul className="mt-2 space-y-1">
                                      {(currentFeedback?.categoryfeedback?.innovation?.strength ? currentFeedback.categoryfeedback.innovation.strength.split(', ') : []).map((str, idx) => (
                                        <li key={idx} className="text-xs text-slate-655 list-disc list-inside leading-relaxed">
                                          {str}
                                        </li>
                                      ))}
                                      {!(currentFeedback?.categoryfeedback?.innovation?.strength) && (
                                        <li className="text-xs text-slate-400 italic">No specific strengths noted.</li>
                                      )}
                                    </ul>
                                  </div>

                                  {/* Weaknesses */}
                                  <div className="mt-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                      Weaknesses
                                    </span>
                                    <ul className="mt-2 space-y-1">
                                      {(currentFeedback?.categoryfeedback?.innovation?.weakness ? currentFeedback.categoryfeedback.innovation.weakness.split(', ') : []).map((wk, idx) => (
                                        <li key={idx} className="text-xs text-slate-655 list-disc list-inside leading-relaxed">
                                          {wk}
                                        </li>
                                      ))}
                                      {!(currentFeedback?.categoryfeedback?.innovation?.weakness) && (
                                        <li className="text-xs text-slate-400 italic">No specific weaknesses noted.</li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Question by Question Review */}
                          <div className="flex flex-col gap-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Detailed Q&A Performance Rubric
                            </h3>
                            <div className="flex flex-col gap-5">
                              {currentFeedback?.convofeedback?.map((q, idx) => (
                                <div key={idx} className="rounded-xl border border-slate-150 bg-slate-50/30 p-5 shadow-sm flex flex-col gap-3">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <span className="inline-flex items-center rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-750">
                                      Question {q.no}
                                    </span>
                                  </div>

                                  {/* Question Block */}
                                  <div className="rounded-xl bg-violet-50/50 border border-violet-100/50 p-4 mt-1.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-violet-750 flex items-center gap-1.5">
                                      Question
                                    </span>
                                    <p className="mt-1.5 text-xs text-slate-655 leading-relaxed italic">
                                      "{conversation[idx].judgeQuestion}"
                                    </p>
                                  </div>

                                  {/* User Answer Block */}
                                  <div className="rounded-xl bg-violet-50/50 border border-violet-100/50 p-4 mt-1.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-violet-750 flex items-center gap-1.5">
                                      Answer
                                    </span>
                                    <p className="mt-1.5 text-xs text-slate-655 leading-relaxed italic">
                                      "{conversation[idx].candidateAnswer}"
                                    </p>
                                  </div>

                                  {/* Feedback Block */}
                                  <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-450 block">Judge's Feedback</span>
                                    <p className="mt-1 text-sm text-slate-700 leading-relaxed font-medium">
                                      {q.feedback}
                                    </p>
                                  </div>

                                  {/* Model Answer Callout */}
                                  <div className="rounded-xl bg-violet-50/50 border border-violet-100/50 p-4 mt-1.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-violet-750 flex items-center gap-1.5">
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                      </svg>
                                      Model Answer Pitch
                                    </span>
                                    <p className="mt-1.5 text-xs text-slate-655 leading-relaxed italic">
                                      "{q.modelanswer}"
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {(!currentFeedback?.convofeedback || currentFeedback.convofeedback.length === 0) && (
                                <div className="text-sm text-slate-400 italic text-center py-6 bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
                                  No question feedback available.
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>

                        {/* Start Again Action Button */}
                        <div className="flex items-center">
                          <button
                            onClick={handleStartButton}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 cursor-pointer"
                          >
                            Start Again
                          </button>

                          <button
                            onClick={handleDelete}
                            className="ml-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>

                      </div>
                    )
                  }
                </>
              ) : loading ? (
                <div className="rounded-xl border border-slate-150 bg-slate-50/50 p-5 shadow-sm h-60 flex flex-col justify-center items-center">
                  <Loader />
                  <div className="flex items-center pt-4 text-slate-600">
                    <span className='font-medium'>Fetching <span className='text-lg text-violet-600'>Project</span></span>
                    <span className="loading-dots"></span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-150 bg-slate-50/50 p-5 shadow-sm h-60 flex justify-center items-center">
                  <p className="text-lg font-semibold uppercase tracking-wider text-violet-650 inline">
                    No Projects yet
                  </p>
                </div>
              )
              }
            </div>
          </div>
        </div>
      </main >

      <AnimatePresence>
        {showErrorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowErrorModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-red-100 bg-white p-6 shadow-2xl animate-in"
            >
              {/* Header decor red line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-650">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Interview Session Error
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-655">
                    {errorMessage || "An unexpected error occurred during your interview session processing."}
                  </p>
                </div>

                <button
                  onClick={() => setShowErrorModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 transition cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </motion.div >
  )
}
