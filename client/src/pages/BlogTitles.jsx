import { useAuth } from '@clerk/clerk-react'
import { Hash, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const BlogTitles = () => {
  const blogCategories = [
    'General',
    'Technology',
    'Business',
    'Health',
    'Lifestyle',
    'Education',
    'Travel',
    'Food',
  ]

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [input, setInput] = useState('')
  const [titles, setTitles] = useState([])
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const prompt = `${input} (${selectedCategory})`

      const { data } = await axios.post(
        '/api/ai/generate-blog-title',
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      )

      if (data.success) {
        setContent(data.content)
        setTitles([])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">
            AI Title Generator
          </h1>
        </div>

        <p className="mt-6 text-sm font-medium">
          Keyword
        </p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artificial intelligence..."
          required
        />

        <p className="mt-4 text-sm font-medium">
          Category
        </p>

        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-[90%]">
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition ${
                selectedCategory === item
                  ? 'bg-purple-50 text-purple-700 border-purple-700'
                  : 'text-gray-500 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5 h-5" />
          )}

          Generate Title
        </button>
      </form>

      {/* Right Column */}
      <div className="flex-1 min-w-[300px]">
        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[500px]">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-[#BE37EB]" />
            <h2 className="text-lg font-semibold">
              Generated Titles
            </h2>
          </div>

          {!content ? (
            titles.length > 0 ? (
              <div className="space-y-3">
                {titles.map((title, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                  >
                    {title}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Enter a topic and click "Generate Title" to get started.
              </p>
            )
          ) : (
            <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
              <div className="reset-tw prose max-w-none">
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogTitles
