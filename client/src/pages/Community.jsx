import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { Heart } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Community = () => {
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)

  const { user } = useUser()
  const { getToken } = useAuth()

  const fetchCreations = async () => {
    try {
      setLoading(true)

      const token = await getToken()

      const { data } = await axios.get(
        '/api/user/get-published-creations',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (data.success) {
        setCreations(data.creations || data.creation || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch creations'
      )
    } finally {
      setLoading(false)
    }
  }

  const imageLikeToggle = async (id) => {
    try {
      const token = await getToken()

      const { data } = await axios.post(
        '/api/user/toggle-like-creation',
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (data.success) {
        await fetchCreations()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update like'
      )
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold text-slate-700">
        Community Creations
      </h1>

      <div className="bg-white h-full w-full rounded-xl overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full min-h-[400px]">
            <span className="w-10 h-10 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></span>
          </div>
        ) : creations.length === 0 ? (
          <div className="flex justify-center items-center h-full min-h-[400px]">
            <p className="text-slate-500">
              No published creations found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creations.map((creation, index) => (
              <div
                key={creation.id || creation._id || index}
                className="relative group overflow-hidden rounded-lg"
              >
                <img
                  src={creation.content}
                  alt={creation.prompt || 'Creation'}
                  className="w-full h-72 object-cover rounded-lg"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {creation.prompt}
                  </p>

                  <div className="flex items-center justify-end gap-2 mt-2">
                    <span className="text-white text-sm">
                      {creation.likes?.length || 0}
                    </span>

                    <Heart
                      onClick={() =>
                        imageLikeToggle(creation.id || creation._id)
                      }
                      className={`w-5 h-5 cursor-pointer hover:scale-110 transition ${
                        creation.likes?.includes(user?.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-white'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Community