import { Eraser, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveBackground = () => {
  const [input, setInput] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input) {
      toast.error('Please select an image')
      return
    }

    try {
      setLoading(true)
      setContent('')

      const formData = new FormData()
      formData.append('image', input)

      const { data } = await axios.post(
        '/api/ai/remove-image-background',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      )

      console.log('API Response:', data)

      if (data.success) {
        setContent(data.content)
        toast.success('Background removed successfully')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)

      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setInput(file)
      setPreview(URL.createObjectURL(file))
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
          <Sparkles className="w-6 text-[#FF4938]" />

          <h1 className="text-xl font-semibold">
            Background Remover
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

        {/* Preview */}
        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              Preview
            </p>

            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
            />
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-70"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          ) : (
            <Eraser className="w-5 h-5" />
          )}

          {loading
            ? 'Removing Background...'
            : 'Remove Background'}
        </button>
      </form>

      {/* Right Column */}
      <div className="flex-1 min-w-[300px]">
        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[500px]">
          <div className="flex items-center gap-2 mb-4">
            <Eraser className="w-5 h-5 text-[#FF4938]" />

            <h2 className="text-lg font-semibold">
              Processed Image
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[350px] border border-dashed border-gray-300 rounded-lg">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>

              <p className="mt-4 text-gray-500">
                Removing background...
              </p>
            </div>
          ) : content ? (
            <div className="flex justify-center">
              <img
                src={content}
                alt="Processed"
                className="max-w-full max-h-[400px] rounded-lg border border-gray-200"
                onError={() =>
                  toast.error('Failed to load image')
                }
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[350px] border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-400 text-sm text-center">
                Upload an image and click "Remove Background" to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RemoveBackground