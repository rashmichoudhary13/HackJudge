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
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export default function LandingPage() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 text-slate-100 antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Navbar />

      <main>
        <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pt-20 md:pb-32 md:pt-28">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-4xl text-center">
            <motion.p
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-violet-200 sm:text-sm"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.08 }}
            >
              <Target className="h-3.5 w-3.5" aria-hidden />
              AI judge panel for hackathon demos
            </motion.p>
            <motion.h1
              className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-bold leading-[1.1] tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.12 }}
            >
              Win Your Next Hackathon Before the Final Pitch.
            </motion.h1>
            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl"
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
                to="/mock-interview"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/30 transition hover:brightness-110 sm:w-auto"
              >
                Start Mock Interview
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <a
                href="#demo"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10 sm:w-auto"
              >
                <Play className="h-5 w-5 fill-current" aria-hidden />
                Watch Demo
              </a>
            </motion.div>
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-24 border-t border-white/5 bg-slate-950/50 px-4 py-20 sm:px-6 md:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Everything you need to nail the demo
              </h2>
              <p className="mt-4 text-slate-400">
                Ship a sharper story, stronger architecture narrative, and
                calmer delivery—before judges ever see you live.
              </p>
            </motion.div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: 'Real-time Feedback',
                  desc: 'Instant analysis of your project explanation as you speak or type—spot weak spots before they cost you.',
                },
                {
                  icon: UserCog,
                  title: 'Persona-based Judges',
                  desc: 'Switch between Technical Judge, Business Judge, or Venture Capitalist to match who you will face on stage.',
                },
                {
                  icon: Mic2,
                  title: 'Edge Case Prep',
                  desc: 'AI generates the hardest questions based on your specific tech stack and README—no generic fluff.',
                },
              ].map(({ icon: Icon, title, desc }, i) => (
                <motion.article
                  key={title}
                  className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 shadow-xl shadow-black/20 transition hover:border-violet-500/30"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30 transition group-hover:bg-violet-500/25">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-400">{desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-24 border-t border-white/5 px-4 py-20 sm:px-6 md:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-slate-400">
                Three steps from README to a winning rehearsal.
              </p>
            </motion.div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Upload your project README or description',
                  desc: 'We ingest your stack, goals, and constraints to personalize every question.',
                  icon: FileText,
                },
                {
                  step: '2',
                  title: 'Start a voice or text-based mock interview',
                  desc: 'Practice naturally—respond out loud or type, with judge personas you choose.',
                  icon: Mic2,
                },
                {
                  step: '3',
                  title: 'Receive a Winning Score and improvement areas',
                  desc: 'Get a clear breakdown of demo strength, clarity, and technical depth.',
                  icon: Sparkles,
                },
              ].map(({ step, title, desc, icon: Icon }, i) => (
                <motion.div
                  key={step}
                  className="relative rounded-2xl border border-white/10 bg-slate-900/40 p-8 md:pt-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <span className="absolute -top-4 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-lg">
                    {step}
                  </span>
                  <Icon
                    className="mb-4 mt-2 h-8 w-8 text-violet-400"
                    aria-hidden
                  />
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-slate-400">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="scroll-mt-24 border-t border-white/5 bg-slate-950/60 px-4 py-20 sm:px-6 md:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Simple pricing for serious builders
              </h2>
              <p className="mt-4 text-slate-400">
                Start free. Upgrade when you are ready for unlimited panels
                and deeper reports.
              </p>
            </motion.div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  name: 'Starter',
                  price: '$0',
                  period: '/ hackathon',
                  features: [
                    '3 mock sessions',
                    '1 judge persona',
                    'Text-only mode',
                  ],
                  cta: 'Start free',
                  featured: false,
                },
                {
                  name: 'Pro',
                  price: '$12',
                  period: '/ month',
                  features: [
                    'Unlimited sessions',
                    'All judge personas',
                    'Voice + text',
                    'Stack-aware edge cases',
                  ],
                  cta: 'Get Pro',
                  featured: true,
                },
                {
                  name: 'Team',
                  price: '$39',
                  period: '/ month',
                  features: [
                    'Everything in Pro',
                    'Shared team workspace',
                    'Export reports',
                    'Priority support',
                  ],
                  cta: 'Talk to us',
                  featured: false,
                },
              ].map((plan, i) => (
                <motion.div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border p-8 ${
                    plan.featured
                      ? 'border-violet-500/50 bg-gradient-to-b from-violet-950/50 to-slate-900/80 shadow-2xl shadow-violet-500/10 md:scale-[1.02]'
                      : 'border-white/10 bg-slate-900/30'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-400">{plan.period}</span>
                  </p>
                  <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-slate-300">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="text-violet-400">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition ${
                      plan.featured
                        ? 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25 hover:brightness-110'
                        : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="login"
          className="scroll-mt-28 border-t border-white/5 px-4 py-12 sm:px-6"
        >
          <p className="text-center text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-violet-400 underline-offset-4 hover:text-violet-300 hover:underline"
            >
              Log in to your dashboard
            </Link>
          </p>
        </section>

        <section
          id="demo"
          className="border-t border-white/5 px-4 py-16 sm:px-6"
        >
          <motion.div
            className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-r from-violet-950/40 to-indigo-950/40 p-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to rehearse like it is finals day?
            </h2>
            <p className="mt-3 text-slate-400">
              Join thousands of builders sharpening their pitch with
              PitchPerfect AI.
            </p>
            <Link
              to="/mock-interview"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/30 transition hover:brightness-110"
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
