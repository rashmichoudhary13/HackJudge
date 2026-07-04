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
              <a
                href="#demo"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-800 backdrop-blur-sm transition hover:border-slate-350 hover:bg-slate-50 sm:w-auto"
              >
                <Play className="h-5 w-5 fill-current" aria-hidden />
                Watch Demo
              </a>
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

        {/* 4-in-1 Capability Suite */}
        <section
          id="features"
          className="scroll-mt-24 border-t border-slate-100 bg-white/50 px-4 py-20 sm:px-6 md:py-10"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                4-in-1 Hackathon Rehearsal Suite
              </h2>
              <p className="mt-4 text-slate-650">
                Everything you need to debug your presentation, strengthen technical architecture narratives, and practice handling tough QA.
              </p>
            </motion.div>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: FileText,
                  title: 'Stack-Aware Reading',
                  desc: 'Ingests your README, codebase details, and pitch slides. AI learns your database, framework, and APIs to ask hyper-specific technical questions.',
                  badge: 'Step 1'
                },
                {
                  icon: UserCog,
                  title: 'Targeted Judge Personas',
                  desc: 'Practice with specialized judges: Aria (VC/Investor), Sophia (CTO/Tech Architect), or Dev (UX/Product Designer) to test every aspect of your project.',
                  badge: 'Step 2'
                },
                {
                  icon: Mic2,
                  title: 'Voice-Enabled QA Simulator',
                  desc: 'Simulate the live panel pressure. Speak naturally—our real-time speech recognizer transcribes and passes answers directly to the AI.',
                  badge: 'Step 3'
                },
                {
                  icon: Sparkles,
                  title: 'Hackathon Rubric Scorecard',
                  desc: 'Receive immediate scores based on real hackathon criteria: Innovation, Technical Depth, UI/UX, Feasibility, and Q&A delivery.',
                  badge: 'Step 4'
                },
              ].map(({ icon: Icon, title, desc, badge }, i) => (
                <motion.article
                  key={title}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/50 transition hover:border-violet-500/30 hover:shadow-violet-100/40"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-650 ring-1 ring-violet-100 transition group-hover:bg-violet-100">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                  <p className="mt-3 leading-relaxed text-xs text-slate-600">{desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Judge Persona Panels Selection */}
        <section className="border-t border-slate-100 px-4 py-20 sm:px-6 md:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Simulate Real Pressure</span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Choose from specialized AI Judge panels
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Different hackathons place priority on different criteria. Toggle judge personas to align with what your upcoming panel values the most.
                </p>
                <div className="mt-8 flex flex-col gap-4">
                  {[
                    { name: 'Aria — The VC / Business Critic', focus: 'Evaluates market viability, business model scaling, and pitch delivery.' },
                    { name: 'Sophia — The CTO / Technical Architect', focus: 'Grills you on codebase choices, API bottlenecks, security, and hosting.' },
                    { name: 'Dev — The Product & UX Designer', focus: 'Examines design consistency, accessibility, user flows, and demo usability.' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-start gap-3 rounded-xl border border-slate-150 bg-white p-4 shadow-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-bold text-violet-600">✓</span>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.focus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphic Simulator Room Mockup */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-tr from-slate-50 to-white p-6 shadow-2xl shadow-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-violet-500 animate-pulse" />
                      <span className="text-xs font-semibold text-slate-700">Sophia's Panel Room — Live Session</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">01:45 / 03:00</span>
                  </div>

                  <div className="space-y-4">
                    {/* Speaker 1 (AI) */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">S</div>
                      <div className="rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-700 leading-relaxed max-w-[85%]">
                        "Your slide deck mentions utilizing PostgreSQL for storing transit routes. Given your real-time mapping goals, why did you choose standard SQL over a Graph Database like Neo4j? How do you handle route caching?"
                      </div>
                    </div>

                    {/* Speaker 2 (User) */}
                    <div className="flex items-start gap-3 justify-end">
                      <div className="rounded-2xl bg-violet-600 px-4 py-3 text-xs text-white leading-relaxed max-w-[85%]">
                        "We chose PostgreSQL because of its PgRouting extension, which allowed us to calculate shortest paths directly via SQL queries. However, for route caching, we implement Redis to store recent calculations and limit DB load."
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-750">Me</div>
                    </div>
                  </div>

                  {/* Speech Level Indicator */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1.5">
                      {[3, 6, 2, 8, 4, 7, 5, 3].map((h, i) => (
                        <span key={i} className="w-1 rounded-full bg-violet-500" style={{ height: `${h * 3}px` }} />
                      ))}
                      <span className="text-[10px] text-slate-400 ml-2">Audio streaming active</span>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Speech Detected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Scorecard & Reports */}
        <section className="border-t border-slate-100 bg-slate-50/30 px-4 py-20 sm:px-6 md:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6 lg:order-2">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Actionable Diagnostics</span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  ATS-style Rubric Scores & Edge Case Reports
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Get a complete breakdown of your demo's strength before presenting live. PitchPerfect AI provides a diagnostic sheet highlighting exactly where your presentation needs work.
                </p>
                <ul className="mt-6 space-y-3.5 text-sm text-slate-600">
                  <li className="flex gap-2.5">
                    <span className="text-violet-500 font-bold">✓</span>
                    <div>
                      <strong>Innovation Audit:</strong> Verify if your product represents a true novelty or is a clone of existing apps.
                    </div>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-violet-500 font-bold">✓</span>
                    <div>
                      <strong>Architecture Validation:</strong> AI points out loopholes in your security, hosting, or API endpoints.
                    </div>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-violet-500 font-bold">✓</span>
                    <div>
                      <strong>Delivery Critique:</strong> Feedback on your verbal pace, speech pauses, and response confidence.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Scorecard Visual Mockup */}
              <div className="lg:col-span-6 lg:order-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-100/60">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider text-slate-400">Mock Performance Report</h3>
                  <div className="space-y-4">
                    {[
                      { criteria: 'Originality & Innovation', score: 8.8, color: 'bg-violet-500' },
                      { criteria: 'Technical Implementation Depth', score: 7.2, color: 'bg-indigo-500' },
                      { criteria: 'Usability & Demo Quality', score: 9.4, color: 'bg-fuchsia-500' },
                      { criteria: 'QA Handling & Delivery', score: 6.8, color: 'bg-rose-500' },
                    ].map((item) => (
                      <div key={item.criteria}>
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                          <span>{item.criteria}</span>
                          <span>{item.score} / 10</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            className={`h-full ${item.color} rounded-full`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.score * 10}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl bg-amber-50 border border-amber-100 p-4 text-xs text-amber-800 leading-relaxed">
                    <strong>Critical Improvement:</strong> "QA score was lowered due to hesitation when explaining database scaling. Consider preparing a slide detailing your horizontal scaling plans."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rehearse Call to Action */}
        <section
          id="demo"
          className="border-t border-slate-100 px-4 py-10 sm:px-6 bg-white"
        >
          <motion.div
            className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-10 text-center shadow-xl shadow-indigo-50/50"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Ready to rehearse like it is finals day?
            </h2>
            <p className="mt-3 text-slate-650">
              Join thousands of builders sharpening their pitch with
              PitchPerfect AI.
            </p>
            <Link
              to="/form"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/20 transition hover:brightness-110"
            >
              Start Mock Interview
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </motion.div>
  )
}
