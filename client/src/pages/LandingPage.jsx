import { motion } from 'framer-motion'
import {
  ArrowRight,
  FileText,
  Mic2,
  Play,
  Sparkles,
  Target,
  UserCog,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import DotField from '../components/DotField.jsx'

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export default function LandingPage() {
  return (
    <motion.div
      className="min-h-screen bg-white text-slate-800 antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 md:pb-32 md:pt-30 flex items-center justify-center min-h-[80vh]">
          {/* DotField Background */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-85">
            <DotField
              dotRadius={1.8}
              dotSpacing={18}
              cursorRadius={240}
              cursorForce={0.08}
              bulgeOnly={true}
              bulgeStrength={65}
              glowRadius={200}
              sparkle={true}
              waveAmplitude={2.5}
              gradientFrom="#8B5CF6"
              gradientTo="#6366F1"
              glowColor="#C084FC"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.1),transparent)] z-0"
            aria-hidden
          />

          <div className="relative mx-auto max-w-4xl text-center z-10">
            <motion.p
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-750 sm:text-sm"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.08 }}
            >
              <Target className="h-3.5 w-3.5" aria-hidden />
              AI judge panel for hackathon demos
            </motion.p>
            <motion.h1
              className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-4xl font-extrabold leading-[1.1] tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.12 }}
            >
              Win Your Next Hackathon Before the Final Pitch.
            </motion.h1>
            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-650 sm:text-xl"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.18 }}
            >
              Practice with our AI Judge to identify flaws in your project,
              refine your demo, and handle tough technical questions with
              confidence.
            </motion.p>
            <motion.div
              id="signup"
              className="mt-10 flex scroll-mt-32 flex-col items-center justify-center gap-4 sm:flex-row"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.24 }}
            >
              <Link
                to="/form"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/20 transition hover:brightness-110 sm:w-auto"
              >
                Start Mock Interview
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Categories Banner */}
        <section className="relative z-10 -mt-8 mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tailored AI Panels for All Major Hackathon Categories
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-6 px-4">
            {['Web & Mobile Apps', 'AI & GenAI Solutions', 'Web3 & Blockchain', 'FinTech & DeFi', 'IoT & Hardware'].map((track) => (
              <span key={track} className="rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-slate-650 shadow-sm backdrop-blur-sm">
                {track}
              </span>
            ))}
          </div>
        </section>

        {/* 4-Step capability Suite */}
        <section
          id="features"
          className="scroll-mt-24 border-t border-slate-100 bg-white/50 px-4 py-20 sm:px-6 md:py-12"
        >
          <div className="mx-auto max-w-7xl">

            <motion.div
              className="mx-auto max-w-2xl text-center pb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                4-Step Hackathon Rehearsal Suite
              </h2>
              <p className="mt-4 text-slate-650">
                A simple and structured process to prepare your pitch, test your project with specialized judges, and ace your Q&A.
              </p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: FileText,
                  step: 'Step 1',
                  title: 'Submit Project Details',
                  desc: 'Fill project details and project slides to customize the AI’s context.'
                },
                {
                  icon: UserCog,
                  step: 'Step 2',
                  title: 'Select Panel Focus',
                  desc: 'Practice with different Judges: Technical, product, business.'
                },
                {
                  icon: Mic2,
                  step: 'Step 3',
                  title: 'Smart Voice Interview',
                  desc: 'Smart voice judging session with real-time speech responses.'
                },
                {
                  icon: Sparkles,
                  step: 'Step 4',
                  title: 'Instant Report',
                  desc: 'Get your report and rubric scorecard with clear improvement points.'
                },
              ].map(({ icon: Icon, step, title, desc }, i) => (
                <motion.article
                  key={step}
                  className={`group relative rounded-2xl bg-white px-6 py-10 text-center shadow-lg shadow-slate-100/50 transition-all duration-300 ${i === 0 ? '-rotate-2 border border-slate-200 hover:border-emerald-500 hover:rotate-0 hover:scale-[1.03] hover:shadow-emerald-500/10' :
                    i === 1 ? 'rotate-1 border border-slate-200 hover:border-emerald-500 hover:rotate-0 hover:scale-[1.03] hover:shadow-emerald-500/10' :
                      i === 2 ? '-rotate-1 border-2 border-slate-200 hover:border-emerald-500 hover:rotate-0 hover:scale-[1.03] hover:shadow-emerald-500/15' :
                        'rotate-2 border border-slate-200 hover:border-emerald-500 hover:rotate-0 hover:scale-[1.03] hover:shadow-emerald-500/10'
                    }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {/* Top floating icon badge */}
                  <div className={`absolute -top-6 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm transition-all duration-300 ${i === 2
                    ? 'border-2 border-emerald-500 text-emerald-600'
                    : 'border border-slate-200 text-slate-500 group-hover:border-emerald-500 group-hover:text-emerald-600'
                    }`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider transition duration-300 ${i === 2 ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'
                    }`}>
                    {step}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition duration-300">{title}</h3>
                  <p className="mt-2.5 leading-relaxed text-xs text-slate-500">{desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced AI Capabilities */}
        <section className="border-t border-slate-100 bg-slate-50/10 px-4 py-20 sm:px-6 md:py-12">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-center mb-16">
              Advanced AI <span className="text-emerald-600">Capabilities</span>
            </h2>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {[
                {
                  title: "AI Answer Evaluation",
                  desc: "Scores communication, technical accuracy, and confidence. Provides score based on conversation, summary, and improvement advice.",
                  icon: Sparkles,
                  illustration: (
                    <svg viewBox="0 0 200 150" className="w-full h-full text-slate-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="75" r="45" fill="#EEF2F6" />
                      <rect x="35" y="55" width="24" height="24" rx="6" fill="#6366F1" />
                      <rect x="42" y="51" width="10" height="4" rx="1" fill="#4338CA" />
                      <circle cx="43" cy="65" r="2.5" fill="white" />
                      <circle cx="51" cy="65" r="2.5" fill="white" />
                      <line x1="42" y1="71" x2="52" y2="71" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M30 85C30 81 33 79 37 79H57C61 79 64 81 64 85V95H30V85Z" fill="#818CF8" />
                      <circle cx="155" cy="63" r="14" fill="#F472B6" />
                      <path d="M141 63C141 55 147 49 155 49C163 49 169 55 169 63V69H141V63Z" fill="#DB2777" />
                      <path d="M141 85C141 80 145 77 150 77H160C165 77 169 80 169 85V95H141V85Z" fill="#F472B6" />
                      <path d="M60 40C60 34 65 30 70 30H85C90 30 94 34 94 40V48C94 53 90 57 85 57H75L68 62V57C64 57 60 53 60 48V40Z" fill="#FBBF24" />
                      <text x="77" y="49" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">!</text>
                      <path d="M140 40C140 34 135 30 130 30H115C110 30 106 34 106 40V48C106 53 110 57 115 57H125L132 62V57C136 57 140 53 140 48V40Z" fill="#3B82F6" />
                      <text x="123" y="49" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">?</text>
                    </svg>
                  )
                },
                {
                  title: "Follow-up Questions",
                  desc: "AI dynamically asks contextual follow-up questions based on your previous answers to drill into technical depth.",
                  icon: Target,
                  illustration: (
                    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="75" r="45" fill="#ECFDF5" />
                      <rect x="75" y="25" width="50" height="26" rx="10" fill="#10B981" />
                      <text x="100" y="42" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Question</text>
                      <path d="M100 51V75" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
                      <path d="M60 75H140" stroke="#10B981" strokeWidth="2" />
                      <path d="M60 75V95" stroke="#10B981" strokeWidth="2" />
                      <path d="M140 75V95" stroke="#10B981" strokeWidth="2" />
                      <rect x="35" y="95" width="50" height="22" rx="8" fill="#3B82F6" />
                      <text x="60" y="108" fill="white" fontSize="8" fontWeight="medium" textAnchor="middle">Follow-up A</text>
                      <rect x="115" y="95" width="50" height="22" rx="8" fill="#6366F1" />
                      <text x="140" y="108" fill="white" fontSize="8" fontWeight="medium" textAnchor="middle">Follow-up B</text>
                    </svg>
                  )
                },
                {
                  title: "Multiple Attempts",
                  desc: "Practice multiple times on the same project and track your history and progress scores over time.",
                  icon: Zap,
                  illustration: (
                    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="75" r="45" fill="#EEF2F6" />
                      <rect x="65" y="40" width="60" height="75" rx="8" fill="white" stroke="#CBD5E1" strokeWidth="2" />
                      <line x1="75" y1="55" x2="115" y2="55" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                      <line x1="75" y1="65" x2="105" y2="65" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                      <rect x="80" y="55" width="60" height="75" rx="8" fill="white" stroke="#6366F1" strokeWidth="2" />
                      <line x1="90" y1="70" x2="130" y2="70" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
                      <line x1="90" y1="80" x2="120" y2="80" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
                      <rect x="108" y="93" width="24" height="12" rx="4" fill="#E0E7FF" />
                      <text x="120" y="102" fill="#4F46E5" fontSize="7" fontWeight="bold" textAnchor="middle">8/10</text>
                      <path d="M50 85C50 65 65 50 85 50" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
                      <path d="M80 46L86 50L80 54" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )
                },
                {
                  title: "Timer Based Simulation",
                  desc: "Face the pressure of real hackathons with a real-time countdown timer in our live judging room.",
                  icon: Target,
                  illustration: (
                    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="75" r="45" fill="#FFFBEB" />
                      <circle cx="100" cy="75" r="35" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 3" />
                      <circle cx="100" cy="75" r="30" fill="white" stroke="#FBBF24" strokeWidth="2" />
                      <path d="M100 75V55" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
                      <path d="M100 75L115 75" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="100" cy="75" r="3" fill="#D97706" />
                      <rect x="96" y="36" width="8" height="4" fill="#D97706" rx="1" />
                      <rect x="130" y="60" width="4" height="6" fill="#D97706" rx="1" transform="rotate(30 130 60)" />
                    </svg>
                  )
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex flex-col sm:flex-row items-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition duration-300 hover:shadow-xl hover:border-slate-350"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  >
                    <div className="w-full sm:w-1/2 aspect-[4/3] flex items-center justify-center bg-slate-50/50 rounded-2xl overflow-hidden p-4 border border-slate-100">
                      {item.illustration}
                    </div>
                    <div className="w-full sm:w-1/2 flex flex-col items-start text-left">
                      <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-slate-500">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How HackJudge Can Help You */}
        <section className="border-t border-slate-100 bg-slate-50/20 px-4 py-20 sm:px-6 md:py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-center mb-16">
              How <span className="text-violet-600">HackJudge</span> Can Help You
            </h2>

            <div className="flex flex-col gap-6">
              {[
                {
                  num: "01",
                  title: "Pitch Deck & Slide Ingestion",
                  desc: "Submit your project slides, problem statement, features, and tech stack. The AI reads and understands your architecture to simulate custom judge panels.",
                  bg: "bg-[#F0F6FF]",
                  border: "border-blue-150 hover:border-blue-400",
                  badgeBg: "from-blue-400 to-blue-600"
                },
                {
                  num: "02",
                  title: "Practice with Specialized Judges",
                  desc: "Test your project from every angle. Toggle between technical critics (Sophia), VC/business judges (Aria), and product experts (Dev).",
                  bg: "bg-[#F2FAF5]",
                  border: "border-emerald-150 hover:border-emerald-400",
                  badgeBg: "from-emerald-400 to-emerald-600"
                },
                {
                  num: "03",
                  title: "Conduct Interactive Voice Sessions",
                  desc: "Speak naturally to answer questions. Our speech recognition and low-latency audio response mimic a real panel interview.",
                  bg: "bg-[#F0F6FF]",
                  border: "border-blue-150 hover:border-blue-400",
                  badgeBg: "from-blue-400 to-blue-600"
                },
                {
                  num: "04",
                  title: "Receive Rubric Scorecard & Summary",
                  desc: "Analyze your performance with a breakdown of scores (Innovation, Feasibility, Q&A) and actionable advice for your pitch.",
                  bg: "bg-[#F2FAF5]",
                  border: "border-emerald-150 hover:border-emerald-400",
                  badgeBg: "from-emerald-400 to-emerald-600"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col sm:flex-row items-start gap-5 p-6 rounded-2xl border transition duration-300 ${item.bg} ${item.border} shadow-sm hover:shadow`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45 }}
                >
                  <div className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.badgeBg} text-white font-extrabold text-lg shadow-md`}>
                    {item.num}
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-500 mt-1.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  )
}
