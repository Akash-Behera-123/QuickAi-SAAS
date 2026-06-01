import { FileText, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const ReviewResume = () => {

  const [input, setInput] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setInput(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log('Resume:', input)
  }

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">

      {/* Left Column */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >

        <div className="flex items-center gap-2">
          <Sparkles className="w-6 text-[#00DA83]" />

          <h1 className="text-xl font-semibold">
            Resume Review
          </h1>
        </div>

        <p className="mt-6 text-sm font-medium">
          Upload Resume
        </p>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />

        <p className="text-xs text-gray-500 font-light mt-1">
          Supports PDF resume only.
        </p>

        <button
          type="submit"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition"
        >
          <FileText className="w-5 h-5" />
          Review Resume
        </button>

      </form>

      {/* Right Column */}
      <div className="flex-1 min-w-[300px]">

        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[500px]">

          <div className="flex items-center gap-2 mb-4">

            <FileText className="w-5 h-5 text-[#00DA83]" />

            <h2 className="text-lg font-semibold">
              Analysis Results
            </h2>

          </div>

          {input ? (

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">

              <div className="flex items-center gap-3">

                <FileText className="w-10 h-10 text-[#00DA83]" />

                <div>
                  <h3 className="font-medium">
                    {input.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    PDF uploaded successfully
                  </p>
                </div>

              </div>

            </div>

          ) : (

            <div className="border border-dashed border-gray-300 rounded-lg min-h-[400px] flex items-center justify-center p-6">

              <div className="text-center">

                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />

                <p className="text-gray-400 text-sm">
                  Upload a resume and click "Review Resume" to get started.
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}

export default ReviewResume