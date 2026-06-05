import { FileText, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import { extractTextFromPDF } from '../utils/extractTextFromPDF'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const ReviewResume = () => {
  const [input, setInput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    setInput(file)
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!input) {
    return toast.error("Please upload a resume");
  }

  try {
    setLoading(true);

    const token = await getToken();

    // extract text
    const text = await extractTextFromPDF(input);

    if (!text) {
      return toast.error("Could not extract text");
    }

    const { data } = await axios.post(
      "/api/ai/resume-review",
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API RESPONSE:", data);

    if (data.success) {
      setContent(data.content);
      toast.success("Resume reviewed successfully");
    } else {
      toast.error(data.message);
    }

  } catch (err) {
    console.log(err);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">

      {/* LEFT */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Resume</p>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
        />

        <button
          disabled={loading}
          type="submit"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white py-2.5 rounded-lg font-medium"
        >
          {loading ? "Processing..." : (
            <>
              <FileText className="w-5 h-5" />
              Review Resume
            </>
          )}
        </button>
      </form>

      {/* RIGHT */}
      <div className="flex-1 min-w-[300px]">
        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[500px]">

          {content ? (
            <div className="p-4 bg-gray-50 border rounded-lg">
              <Markdown>{content}</Markdown>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Upload a resume to see analysis here.
            </p>
          )}

        </div>
      </div>

    </div>
  )
}

export default ReviewResume