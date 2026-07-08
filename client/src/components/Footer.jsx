import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 px-4 py-10 sm:px-6 bg-[#FFFEEE]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
        <p className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
          © {new Date().getFullYear()} PitchPerfect AI. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link to="/login" className="hover:text-slate-800">
            Login
          </Link>
          <Link to="/signup" className="hover:text-slate-800">
            Sign Up
          </Link>
        </div>
      </div>
    </footer>
  )
}
