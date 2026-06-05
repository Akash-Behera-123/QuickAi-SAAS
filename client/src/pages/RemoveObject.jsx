import { Scissors, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveObject = () => {
  const [input, setInput] = useState(null)
  const [preview, setPreview] = useState(null)
  const [object, setObject] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    setInput(file)
    setPreview(URL.createObjectURL(file))
    setContent('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input) {
      return toast.error('Please select an image')
    }

    try {
      setLoading(true)

      if (object.trim().split(/\s+/).length > 1) {
        return toast.error('Please enter only one object name')
      }

      const formData = new FormData()
      formData.append('image', input)
      formData.append('object', object.trim())

      const token = await getToken()

      const { data } = await axios.post(
        '/api/ai/remove-image-object',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log('API Response:', data)

      if (data.success) {
        setContent(data.content)
        toast.success('Object removed successfully')
      } else {
        toast.error(data.message || 'Something went wrong')
      }
    } catch (error) {
      console.error(error)

      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Failed to remove object'
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
          <Sparkles className="w-6 text-[#4A7AFF]" />

          <h1 className="text-xl font-semibold">
            Object Removal
          </h1>
        </div>

        <p className="mt-6 text-sm font-medium">
          Upload Image
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />

        <p className="text-xs text-gray-500 font-light mt-1">
          Supports JPG, PNG, and other image formats
        </p>

        <p className="mt-6 text-sm font-medium">
          Describe Object to Remove
        </p>

        <textarea
          value={object}
          onChange={(e) => setObject(e.target.value)}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 resize-none"
          placeholder="e.g. watch, spoon, bottle, chair"
          required
        />

        <button
          disabled={loading}
          type="submit"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#BE37EB] text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <Scissors className="w-5 h-5" />
              Remove Object
            </>
          )}
        </button>
      </form>

      {/* Right Column */}
      <div className="flex-1 min-w-[300px]">
        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[500px]">
          <div className="flex items-center gap-2 mb-4">
            <Scissors className="w-5 h-5 text-[#4A7AFF]" />

            <h2 className="text-lg font-semibold">
              Processed Image
            </h2>
          </div>

          {content ? (
            <div className="flex justify-center">
              <img
                src={content}
                alt="Processed"
                className="max-w-full max-h-[400px] rounded-lg border border-gray-200"
              />
            </div>
          ) : preview ? (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-[400px] rounded-lg border border-gray-200"
              />
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg min-h-[400px] flex items-center justify-center p-6">
              <div className="text-center">
                <Scissors className="w-12 h-12 mx-auto text-gray-300 mb-3" />

                <p className="text-gray-400 text-sm">
                  Upload an image and click "Remove Object" to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RemoveObject