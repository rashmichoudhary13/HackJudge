import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'
import { useAuth, auth } from '../context/auth.jsx'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[error, setError] = useState(null);

  const navigate = useNavigate();
  const {signIn} = useAuth();

  const storeUserInfo = async (name, email) => {
    try{
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({name, email}),
      });
  
      const data = await response.json();

      if(!response.ok){
        console.log("Failed to store data");
      }

      console.log("Signup page data: ", data.message);
    } catch(err){
      console.error("Error storing user: ", err.message);
    }
  }


  const handlesubmit = async (e) => {
    e.preventDefault();
    try{
      await signIn(name,email,password);
      await storeUserInfo(name,email);
      navigate('/login');
    } catch (error) {
      console.error("Error signing up: ", error.message);
      setError("Email already in use");
    }
  }

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 text-slate-100 antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Navbar
        variant="minimal"
        trailing={
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-violet-300 transition hover:text-white"
            >
              Log in
            </Link>
          </p>
        }
      />

      <main className="relative flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
          aria-hidden
        />
        <motion.div
          className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/50 p-8 shadow-2xl shadow-violet-950/40 backdrop-blur-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
        >
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Start practicing with the AI judge in minutes.
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
                htmlFor="signup-name"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Full name
              </label>
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/30 transition placeholder:text-slate-500 focus:border-violet-500/40 focus:ring-2"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label
                htmlFor="signup-email"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/30 transition placeholder:text-slate-500 focus:border-violet-500/40 focus:ring-2"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="signup-password"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-3 pl-4 pr-12 text-slate-100 outline-none ring-violet-500/30 transition placeholder:text-slate-500 focus:border-violet-500/40 focus:ring-2"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
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
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-400">
              <input
                type="checkbox"
                required
                className="mt-1 size-4 rounded border-white/20 bg-slate-950 text-violet-500 focus:ring-violet-500/40"
              />
              <span>
                I agree to the{' '}
                <button
                  type="button"
                  className="font-medium text-violet-300 hover:text-white"
                >
                  Terms
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="font-medium text-violet-300 hover:text-white"
                >
                  Privacy Policy
                </button>
                .
              </span>
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
            >
              Create account
            </button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  )
}
