import { Image, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const GenerateImages = () => {
  const imageStyles = [
    'Realistic',
    'Ghibli style',
    'Anime style',
    'Cartoon style',
    'Fantasy style',
    '3D style',
    'Portrait style',
  ]

  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log({
      prompt: input,
      style: selectedStyle,
      publish,
    })

    // Replace with your API response later
    setImageUrl('https://via.placeholder.com/800x500?text=Generated+Image')
  }

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        {/* Heading */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">
            AI Image Generator
          </h1>
        </div>

        {/* Prompt */}
        <p className="mt-6 text-sm font-medium">
          Describe Your Image
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Describe what you want to see in the image..."
          required
        />

        {/* Style Selection */}
        <p className="mt-4 text-sm font-medium">
          Style
        </p>

        <div className="mt-3 flex gap-3 flex-wrap">
          {imageStyles.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition ${
                selectedStyle === item
                  ? 'bg-green-50 text-green-700 border-green-700'
                  : 'text-gray-500 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Publish Toggle */}
        <div className="my-6 flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
            />

            <div className="w-11 h-6 bg-slate-300 rounded-full transition-colors peer-checked:bg-green-500"></div>

            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
          </label>

          <p className="text-sm">
            Make this image public
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition"
        >
          <Image className="w-5 h-5" />
          Generate Image
        </button>
      </form>

      {/* Right Column */}
      <div className="flex-1 min-w-[300px]">
        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[500px]">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5 text-[#00AD25]" />
            <h2 className="text-lg font-semibold">
              Generated Image
            </h2>
          </div>

          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-[350px] border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-400 text-sm text-center">
                Enter a prompt and click "Generate Image" to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GenerateImages