import { Sparkles, Edit } from 'lucide-react'
import React, { useState } from 'react'

const WriteArticle = () => {

  const articleLength = [
    {
      length: 800,
      text: 'Short (600-800 words)',
    },

    {
      length: 1200,
      text: 'Medium (800-1200 words)',
    },

    {
      length: 1600,
      text: 'Long (1200+ words)',
    },
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0])

  const [input, setInput] = useState('')

  const handleSubmit = (e) => {

    e.preventDefault()

    console.log({
      topic: input,
      length: selectedLength,
    })
  }

  return (

    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* Left Column */}
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'
      >

        {/* Heading */}
        <div className='flex items-center gap-2'>

          <Sparkles className='w-6 text-[#4A7AFF]' />

          <h1 className='text-xl font-semibold'>
            Article Configuration
          </h1>

        </div>

        {/* Article Topic */}
        <p className='mt-6 text-sm font-medium'>
          Article Topic
        </p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='The future of artificial intelligence is....'
          required
        />

        {/* Article Length */}
        <p className='mt-4 text-sm font-medium'>
          Article Length
        </p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-[90%]'>

          {articleLength.map((item, index) => (

            <span
              key={index}
              onClick={() => setSelectedLength(item)}

              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition

              ${
                selectedLength.text === item.text
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'text-gray-500 border-gray-300 hover:bg-gray-50'
              }`}
            >

              {item.text}

            </span>

          ))}

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className='mt-6 w-full flex items-center justify-center gap-2
          bg-gradient-to-r from-[#3C81F6] to-[#9234EA]
          text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition'
        >

          <Edit className='w-5 h-5' />

          Generate Article

        </button>

      </form>

      {/* Right Column */}
  {/* Right Column */}
<div className="flex-1 min-w-[300px]">

  <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[500px]">

    <div className="flex items-center gap-2 mb-4">

      <Edit className="w-5 h-5 text-[#4A7AFF]" />

      <h2 className="text-lg font-semibold text-slate-700">
        Generated Article
      </h2>

    </div>

    <div className="border border-dashed border-gray-300 rounded-lg min-h-[400px] flex items-center justify-center p-6">

      <div className="text-center">

        <Edit className="w-12 h-12 mx-auto text-gray-300 mb-3" />

        <p className="text-gray-400 text-sm">
          Your AI-generated article will appear here.
        </p>

        <p className="text-gray-300 text-xs mt-2">
          Enter a topic, choose a length, and click
          <span className="font-medium text-gray-500">
            {" "}Generate Article
          </span>
        </p>

      </div>

    </div>

  </div>

</div>

    </div>
  )
}

export default WriteArticle