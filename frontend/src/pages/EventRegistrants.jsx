import { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Mail, MapPin, MessageCircle, Users } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { eventsApi } from '../services/events'
import { chatApi } from '../services/chat'

export default function EventRegistrants() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [registrants, setRegistrants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chattingWithId, setChattingWithId] = useState(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([eventsApi.getById(id), eventsApi.getRegistrants(id)])
      .then(([eventData, registrantData]) => {
        if (!cancelled) {
          setEvent(eventData)
          setRegistrants(registrantData || [])
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Unable to load registered users.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const handleChat = async (registrantId) => {
    setChattingWithId(registrantId)
    setError(null)
    try {
      const conversation = await chatApi.getOrCreateConversation(registrantId)
      await chatApi.sendMessage({
        conversationId: conversation.id,
        text: `Hi, thanks for registering for "${event?.title || 'the event'}". I wanted to connect with you about the event.`,
        type: 'TEXT',
      })
      navigate(`/chat?conversation=${conversation.id}`)
    } catch (err) {
      setError(err.message || 'Unable to open chat.')
    } finally {
      setChattingWithId(null)
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-4xl px-6 py-12 text-center text-[#6B7280]">Loading registered users...</div>
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] hover:text-[#FF7A00]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to events
      </button>

      {error && <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {event && (
        <section className="mb-6 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#FF7A00]">Event registrations</p>
          <h1 className="mt-2 text-3xl font-bold text-[#1F2937]">{event.title}</h1>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#6B7280]">
            <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-[#FF7A00]" />{event.date} · {event.time}</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#FF7A00]" />{event.location}</span>
            <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-[#FF7A00]" />{registrants.length} registered</span>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#1F2937]">Registered users</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Connect with students who are joining your event.</p>

        {registrants.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-[#FFFBF5] px-5 py-8 text-center text-sm text-[#6B7280]">
            No one has registered for this event yet.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {registrants.map((registrant) => (
              <div key={registrant.id} className="flex flex-col gap-4 rounded-2xl border border-[#E5E7EB] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-[#1F2937]">{registrant.name}</p>
                  <p className="mt-1 inline-flex max-w-full items-center gap-2 truncate text-sm text-[#6B7280]"><Mail className="h-4 w-4 shrink-0" />{registrant.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChat(registrant.id)}
                  disabled={chattingWithId === registrant.id}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF7A00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e86f00] disabled:opacity-60"
                >
                  <MessageCircle className="h-4 w-4" />
                  {chattingWithId === registrant.id ? 'Opening...' : 'Chat'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
