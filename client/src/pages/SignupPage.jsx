// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/auth.jsx'
import { auth } from '../context/firebase.js'

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
      className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white text-slate-800 antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Navbar
        variant="minimal"
        trailing={
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-violet-650 transition hover:text-violet-855"
            >
              Log in
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
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
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-violet-500/30 transition placeholder:text-slate-400 focus:border-violet-500/65 focus:bg-white focus:ring-2"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label
                htmlFor="signup-email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-violet-500/30 transition placeholder:text-slate-400 focus:border-violet-500/65 focus:bg-white focus:ring-2"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="signup-password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-slate-900 outline-none ring-violet-500/30 transition placeholder:text-slate-400 focus:border-violet-500/65 focus:bg-white focus:ring-2"
                  placeholder="At least 8 characters"
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
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                required
                className="mt-1 size-4 rounded border-slate-300 bg-white text-violet-500 focus:ring-violet-500/40"
              />
              <span>
                I agree to the{' '}
                <button
                  type="button"
                  className="font-medium text-violet-650 hover:text-violet-850"
                >
                  Terms
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="font-medium text-violet-650 hover:text-violet-855"
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
