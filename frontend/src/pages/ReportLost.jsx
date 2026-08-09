import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Upload, X } from 'lucide-react'
import { lostFoundApi } from '../services/lostFound'

export default function ReportLost() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    date: '',
    description: '',
    contact: '',
    type: 'LOST',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let imageUrl = ''
      if (imageFile) {
        const uploadResult = await lostFoundApi.uploadImage(imageFile)
        imageUrl = uploadResult.imageUrl
      }

      await lostFoundApi.create({ ...form, imageUrl })
      navigate('/lost-found')
    } catch (err) {
      setError(err.message || 'Failed to report lost item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-[#FF7A00]" />
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Report Lost Item</h1>
          <p className="text-[#6B7280]">Help others help you find your item.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Item Name</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            placeholder="e.g., Blue Backpack"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            >
              <option value="">Select category</option>
              <option>Electronics</option>
              <option>Books</option>
              <option>Bags</option>
              <option>Documents</option>
              <option>Accessories</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">Date Lost</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Location</label>
          <input
            type="text"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            placeholder="e.g., Library entrance"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            placeholder="Describe the item and any identifying features..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Contact Email</label>
          <input
            type="email"
            required
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Photo (optional)</label>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="h-32 w-32 rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-[#6B7280]" />
                </button>
              </div>
            ) : (
              <label className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] hover:border-[#FF7A00]">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-[#6B7280]" />
                  <p className="mt-1 text-sm text-[#6B7280]">Click to upload image</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-full bg-[#FF7A00] py-3 font-semibold text-white hover:bg-[#e86f00] disabled:opacity-60">
          {loading ? 'Reporting...' : 'Report Lost Item'}
        </button>
      </form>
    </div>
  )
}
