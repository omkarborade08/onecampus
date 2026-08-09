import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/mockData'
import { Upload, X } from 'lucide-react'
import { marketplaceApi } from '../services/marketplace'

export default function MarketplaceSell() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: CATEGORIES[1],
    condition: 'Good',
    description: '',
    imageUrl: '',
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
    setForm({ ...form, imageUrl: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let imageUrl = form.imageUrl
      if (imageFile) {
        const uploadResult = await marketplaceApi.uploadImage(imageFile)
        imageUrl = uploadResult.imageUrl
      }

      await marketplaceApi.create({
        ...form,
        price: Number(form.price),
        imageUrl: imageUrl || '',
      })
      navigate('/marketplace')
    } catch (err) {
      setError(err.message || 'Failed to list item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold text-[#1F2937]">Sell an Item</h1>
      <p className="mt-2 text-[#6B7280]">List your item for students on your campus.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            placeholder="e.g., DSA Textbook"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">Price (₹)</label>
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
              placeholder="450"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Condition</label>
          <select
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
          >
            <option>New</option>
            <option>Like new</option>
            <option>Good</option>
            <option>Used</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
            placeholder="Describe your item..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Image</label>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="h-48 w-48 rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-[#6B7280]" />
                </button>
              </div>
            ) : (
              <label className="flex h-48 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] hover:border-[#FF7A00]">
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
          {loading ? 'Listing...' : 'List Item'}
        </button>
      </form>
    </div>
  )
}
