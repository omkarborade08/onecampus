import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authApi.login(form)
      const token = response.token
      const refreshToken = response.refreshToken
      if (token) {
        localStorage.setItem('campusconnect_token', token)
        login({
          email: response.email,
          mobile: response.mobile,
          name: response.name,
          college: response.college,
          role: response.role,
          id: response.id,
          campusId: response.campusId,
          campusName: response.campusName,
        }, refreshToken)
      }
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1F2937]">Welcome back</h1>
        <p className="mt-2 text-[#6B7280]">Sign in to your OneCampus account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[#FF7A00] py-3 font-semibold text-white hover:bg-[#e86f00] disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Don't have an account? <Link to="/signup" className="font-semibold text-[#FF7A00] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}


