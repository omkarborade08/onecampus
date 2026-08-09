import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth'
import { campusesApi } from '../services/campuses'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [campuses, setCampuses] = useState([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    confirmPassword: '',
    campusId: '',
    newCampusName: '',
    newCampusLocation: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    campusesApi.getAll().then((data) => setCampuses(data || [])).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        college: form.college,
      }

      if (form.campusId === 'other') {
        payload.newCampusName = form.newCampusName
        payload.newCampusLocation = form.newCampusLocation
      } else if (form.campusId) {
        payload.campusId = form.campusId
      }

      const response = await authApi.register(payload)

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
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const selectedCampus = form.campusId === 'other' ? 'other' : form.campusId

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1F2937]">Create an account</h1>
        <p className="mt-2 text-[#6B7280]">Join your campus community today.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            />
          </div>
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
            <label className="block text-sm font-medium text-[#1F2937]">Campus</label>
            <select
              value={selectedCampus}
              onChange={(e) => setForm({ ...form, campusId: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            >
              <option value="">Select campus</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>{campus.name}</option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>

          {selectedCampus === 'other' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#1F2937]">Campus Name</label>
                <input
                  type="text"
                  required
                  value={form.newCampusName}
                  onChange={(e) => setForm({ ...form, newCampusName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
                  placeholder="e.g., IIT Bombay"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937]">Campus Location</label>
                <input
                  type="text"
                  required
                  value={form.newCampusLocation}
                  onChange={(e) => setForm({ ...form, newCampusLocation: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
                  placeholder="e.g., Mumbai"
                />
              </div>
            </div>
          )}

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
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-[#FF7A00] py-3 font-semibold text-white hover:bg-[#e86f00] disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Already have an account? <Link to="/login" className="font-semibold text-[#FF7A00] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}


