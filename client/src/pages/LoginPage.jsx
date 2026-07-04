import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import {useAuth} from '../context/auth.jsx'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const {LogIn} = useAuth();

  const navigate = useNavigate();

  const handlesubmit = async(e) => {
    e.preventDefault();
    try{
      await LogIn(email,password);
      navigate('/');
    } catch (err){
      console.error("Logging error: ", err.message);
      setError("Credentials are Invalid");
    }
  }

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white text-slate-800 antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Navbar
        variant="minimal"
        trailing={
          <p className="text-sm text-slate-600">
            No account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-violet-650 transition hover:text-violet-850"
            >
              Sign up
            </Link>
          </p>
        }
      />

      <main className="relative flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.1),transparent)]"
          aria-hidden
        />
        <motion.div
          className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
        >
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to continue practicing your pitch.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <form
            className="mt-8 space-y-5"
            onSubmit={handlesubmit}
          >
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="login-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-violet-500/30 transition placeholder:text-slate-400 focus:border-violet-500/65 focus:bg-white focus:ring-2"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-violet-600 transition hover:text-violet-850"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-slate-900 outline-none ring-violet-500/30 transition placeholder:text-slate-400 focus:border-violet-500/65 focus:bg-white focus:ring-2"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
            >
              Sign in
            </button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  )
}
