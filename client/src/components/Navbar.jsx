import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const shellClass =
  'sticky top-0 z-50 border-b border-white/10 bg-slate-950/65 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150'

function BrandLink() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-semibold tracking-tight text-white"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
        <Sparkles className="h-4 w-4 text-white" aria-hidden />
      </span>
      PitchPerfect AI
    </Link>
  )
}

export default function Navbar({ variant = 'marketing', trailing = null }) {
  if (variant === 'minimal') {
    return (
      <header className={shellClass}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <BrandLink />
          {trailing}
        </div>
      </header>
    )
  }

  return (
    <header className={shellClass}>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:h-16 md:flex-row md:items-center md:justify-between md:py-0">
        <div className="flex items-center justify-between gap-4 md:justify-start md:shrink-0">
          <BrandLink />
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:brightness-110"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-300 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:justify-center md:text-[15px]"
          aria-label="Primary"
        >
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-white">
            How it Works
          </a>
          <a href="#pricing" className="transition hover:text-white">
            Pricing
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex md:shrink-0">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}
