import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, Plus, X } from 'lucide-react'
import { eventsApi } from '../services/events'
import { useAuth } from '../context/AuthContext'

export default function Events() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [createSuccess, setCreateSuccess] = useState(null)
  const [registeringId, setRegisteringId] = useState(null)
  const [registrationError, setRegistrationError] = useState(null)
  const [form, setForm] = useState(() => ({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    organizer: user?.name || '',
    imageUrl: '',
    category: 'Technical',
  }))

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    eventsApi
      .getAll(filter)
      .then((data) => {
        if (!cancelled) {
          const mapped = (data || []).map((event) => ({
            ...event,
            image: event.imageUrl || null,
          }))
          setEvents(mapped)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [filter])

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setCreating(true)
    setCreateError(null)
    setCreateSuccess(null)

    try {
      await eventsApi.create({ ...form, organizer: form.organizer || user?.name || '' })
      setForm({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        organizer: user?.name || '',
        imageUrl: '',
        category: 'Technical',
      })
      setShowCreateForm(false)
      setCreateSuccess('Event created successfully.')
      const refreshed = await eventsApi.getAll(filter)
      setEvents((refreshed || []).map((item) => ({
        ...item,
        image: item.imageUrl || null,
      })))
    } catch (err) {
      setCreateError(err.message || 'Unable to create event.')
    } finally {
      setCreating(false)
    }
  }

  const handleRegister = async (eventId) => {
    setRegisteringId(eventId)
    setRegistrationError(null)
    try {
      const updatedEvent = await eventsApi.register(eventId)
      setEvents((current) => current.map((event) => event.id === eventId
        ? { ...updatedEvent, image: updatedEvent.imageUrl || null }
        : event))
    } catch (err) {
      setRegistrationError(err.message || 'Unable to register for this event.')
    } finally {
      setRegisteringId(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Campus Events</h1>
          <p className="mt-2 text-[#6B7280]">Discover what's happening around campus.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowCreateForm((current) => !current)
            setCreateError(null)
            setCreateSuccess(null)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF7A00] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#e86f00]"
        >
          {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showCreateForm ? 'Close form' : 'Add event'}
        </button>
      </div>

      {createSuccess && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{createSuccess}</p>}
      {registrationError && <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{registrationError}</p>}

      {showCreateForm && (
        <form onSubmit={handleCreate} className="mb-8 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#1F2937]">Create a campus event</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Share the details so students on your campus can find it.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['title', 'Event title', 'text'],
              ['date', 'Date', 'date'],
              ['time', 'Time', 'time'],
              ['location', 'Location', 'text'],
              ['organizer', 'Organizer', 'text'],
              ['imageUrl', 'Image URL (optional)', 'url'],
            ].map(([field, label, type]) => (
              <label key={field} className="block text-sm font-medium text-[#1F2937]">
                {label}
                <input
                  type={type}
                  required={!['imageUrl'].includes(field)}
                  value={form[field]}
                  onChange={(event) => updateForm(field, event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 font-normal focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
                />
              </label>
            ))}
            <label className="block text-sm font-medium text-[#1F2937]">
              Category
              <select
                value={form.category}
                onChange={(event) => updateForm('category', event.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 font-normal focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
              >
                <option>Technical</option>
                <option>Cultural</option>
                <option>Social</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-[#1F2937] md:col-span-2">
              Description
              <textarea
                required
                rows="4"
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
                className="mt-1 w-full resize-y rounded-xl border border-[#E5E7EB] px-4 py-3 font-normal focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
              />
            </label>
          </div>
          {createError && <p className="mt-4 text-sm text-red-600">{createError}</p>}
          <button
            type="submit"
            disabled={creating}
            className="mt-5 rounded-full bg-[#FF7A00] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e86f00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Creating event...' : 'Create event'}
          </button>
        </form>
      )}

      <div className="mb-6 flex gap-2">
        {['all', 'Technical', 'Cultural', 'Social'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
              filter === cat ? 'bg-[#FF7A00] text-white' : 'border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#FF7A00] hover:text-[#FF7A00]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-[#6B7280]">Loading events...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-3xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-video overflow-hidden bg-gray-100">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#FFF0E0] text-6xl" role="img" aria-label="Event has no image">
                    🎟️
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="text-xs font-medium text-[#FF7A00]">{event.category}</span>
                <h3 className="mt-1 text-lg font-semibold text-[#1F2937]">{event.title}</h3>
                <p className="mt-2 text-sm text-[#6B7280] line-clamp-2">{event.description}</p>
                <div className="mt-4 space-y-2 text-sm text-[#6B7280]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#FF7A00]" />
                    <span>{event.date} · {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#FF7A00]" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#FF7A00]" />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
                {event.creatorId !== user?.id && event.organizer?.toLowerCase() !== user?.name?.toLowerCase() && (
                  <button
                    type="button"
                    disabled={event.registered || registeringId === event.id}
                    onClick={() => handleRegister(event.id)}
                    className={`mt-4 w-full rounded-full border py-2 text-sm font-semibold transition ${
                      event.registered
                        ? 'cursor-default border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white'
                    }`}
                  >
                    {event.registered ? 'Registered' : registeringId === event.id ? 'Registering...' : 'Register'}
                  </button>
                )}
                {(event.creatorId === user?.id || event.organizer?.toLowerCase() === user?.name?.toLowerCase()) && (
                  <button
                    type="button"
                    onClick={() => navigate(`/events/${event.id}/registrants`)}
                    className="mt-4 w-full rounded-full border border-[#1F2937] py-2 text-sm font-semibold text-[#1F2937] hover:bg-[#1F2937] hover:text-white"
                  >
                    View registered users
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="mt-12 text-center text-[#6B7280]">
          <p className="text-lg">No events found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
