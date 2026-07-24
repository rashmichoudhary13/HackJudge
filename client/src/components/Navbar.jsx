import { Sparkles, Menu } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { useState } from 'react'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Form', to: '/form' },
  { label: 'Dashboard', to: '/dashboard' },
]

function navLinkClass({ isActive }) {
  return `md:block transition hover:text-slate-950${isActive ? ' text-slate-950 font-semibold' : ''}`
}

const shellClass =
  'sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-xl backdrop-saturate-150'

function BrandLink() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-semibold tracking-tight text-slate-900"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
        <Sparkles className="h-4 w-4 text-white" aria-hidden />
      </span>
      HackJudge
    </Link>
  )
}

function PrimaryNav({ className }) {
  return (
    <nav className={className} aria-label="Primary">
      {navItems.map(({ label, to }) => (
        <NavLink key={to} to={to} end={to === '/'} className={navLinkClass}>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function MobileNav() {
  return (
    <nav className='text-xl' aria-label="Primary">
      {navItems.map(({ label, to }) => (
        <NavLink key={to} to={to} end={to === '/'} className='flex flex-col justify-center items-center mb-3'>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Navbar({ variant = 'marketing', trailing = null }) {
  const { isLoggedIn, LogOut } = useAuth();
  const [isOpen, SetIsOpen] = useState(false);

  // if (loading) return null;

  const handleLogOut = async () => {
    try {
      await LogOut();
    } catch (err) {
      console.error(err);
    }
  }

  if (variant === 'minimal') {
    return (
      <header className={shellClass}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <BrandLink />
          <PrimaryNav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex" />
          {trailing}
        </div>
      </header>
    )
  }

  return (
    <header className={shellClass}>
      <div className="relative mx-auto flex max-w-7xl gap-3 px-4 py-3 sm:px-6 md:h-16 flex-row md:items-center justify-between md:py-0">
        <div className="flex items-center justify-between gap-4 md:justify-start md:shrink-0">
          <BrandLink />
        </div>

        <PrimaryNav className="hidden md:flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:justify-center md:text-[15px]" />
        <Menu className='block md:hidden mt-1' onClick={() => SetIsOpen(prev => !prev)} />

        {isLoggedIn ? (
          <div className="hidden items-center gap-3 md:flex md:shrink-0">
            <button
              onClick={handleLogOut}
              className="rounded-lg cursor-pointer bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
            >
              Log Out
            </button>
          </div>) : (
          <div className="hidden items-center gap-3 md:flex md:shrink-0">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
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
        )}

      </div>


      {isOpen && (
        <div className='absolute bg-white right-0 left-0'>
          <MobileNav />
          {isLoggedIn ? (
            <div className="text-center mt-5 mb-8">
              <button
                onClick={handleLogOut}
                className="rounded-lg cursor-pointer bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-7 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Log Out
              </button>
            </div>) : (
            <div className="text-center mt-5 mb-8">
              <Link
                to="/login"
                className="rounded-lg bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-7 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      )}

    </header>
  )
}
