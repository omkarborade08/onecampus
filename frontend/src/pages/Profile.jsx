import { useEffect, useState } from 'react'
import { ArrowLeft, Building2, Mail, Pencil, Phone, Save, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { profileApi } from '../services/profile'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', mobile: user?.mobile || '', college: user?.college || '' })
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    profileApi.get().then((data) => {
      setForm({ name: data.name || '', email: data.email || '', mobile: data.mobile || '', college: data.college || '' })
      updateUser(data)
    }).catch(() => {})
  }, [])

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const updated = await profileApi.update(form)
      localStorage.setItem('campusconnect_token', updated.token)
      localStorage.setItem('campusconnect_refresh_token', updated.refreshToken)
      updateUser(updated)
      setForm({ name: updated.name, email: updated.email, mobile: updated.mobile || '', college: updated.college || '' })
      setEditing(false)
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err.message || 'Unable to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] hover:text-[#FF7A00]">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF7A00] text-2xl font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <div><p className="text-sm text-[#6B7280]">Your profile</p><h1 className="text-2xl font-bold text-[#1F2937]">{user?.name}</h1></div>
          </div>
          <button type="button" onClick={() => setEditing((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#FF7A00] px-4 py-2 text-sm font-semibold text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white">
            <Pencil className="h-4 w-4" /> {editing ? 'Cancel' : 'Edit profile'}
          </button>
        </div>
        {message && <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {editing ? (
          <form onSubmit={handleSave} className="mt-8 space-y-4">
            <label className="block text-sm font-medium text-[#1F2937]">Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 focus:border-[#FF7A00] focus:outline-none" /></label>
            <label className="block text-sm font-medium text-[#1F2937]">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 focus:border-[#FF7A00] focus:outline-none" /></label>
            <label className="block text-sm font-medium text-[#1F2937]">Mobile number<input type="tel" value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 focus:border-[#FF7A00] focus:outline-none" /></label>
            <div className="rounded-xl border border-[#E5E7EB] bg-gray-50 px-4 py-3 text-sm text-[#6B7280]"><span className="font-medium text-[#1F2937]">Campus</span><p className="mt-1 flex items-center gap-2"><Building2 className="h-4 w-4 text-[#FF7A00]" />{user?.campusName || 'Campus not assigned'}</p><p className="mt-1 text-xs">Campus cannot be changed from your profile.</p></div>
            <button disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#FF7A00] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save changes'}</button>
          </form>
        ) : (
          <div className="mt-8 space-y-4 text-sm">
            <p className="flex items-center gap-3 text-[#6B7280]"><Mail className="h-5 w-5 text-[#FF7A00]" />{user?.email}</p>
            <p className="flex items-center gap-3 text-[#6B7280]"><Phone className="h-5 w-5 text-[#FF7A00]" />{user?.mobile || 'Mobile number not added'}</p>
            <p className="flex items-center gap-3 text-[#6B7280]"><Building2 className="h-5 w-5 text-[#FF7A00]" />{user?.campusName || 'Campus not assigned'}</p>
          </div>
        )}
      </section>
    </div>
  )
}