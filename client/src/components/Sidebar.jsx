import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth, useClerk, useUser } from '@clerk/clerk-react'

import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  Scissors,
  SquarePen,
  Users,
  LogOut,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'

const navItems = [
  {
    to: '/ai',
    label: 'Dashboard',
    Icon: House,
  },
  {
    to: '/ai/write-article',
    label: 'Write Article',
    Icon: SquarePen,
  },
  {
    to: '/ai/blog-titles',
    label: 'Blog Titles',
    Icon: Hash,
  },
  {
    to: '/ai/generate-images',
    label: 'Generate Images',
    Icon: Image,
  },
  {
    to: '/ai/remove-background',
    label: 'Remove Background',
    Icon: Eraser,
  },
  {
    to: '/ai/remove-object',
    label: 'Remove Object',
    Icon: Scissors,
  },
  {
    to: '/ai/review-resume',
    label: 'Review Resume',
    Icon: FileText,
  },
  {
    to: '/ai/community',
    label: 'Community',
    Icon: Users,
  },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const { getToken } = useAuth()

  const [plan, setPlan] = useState('free')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('/api/user/get-user-data', {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        })

        if (data.success) {
          setPlan(data.plan)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchUserData()
  }, [])

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200
      flex flex-col justify-between items-center
      max-sm:absolute max-sm:z-50 top-14 bottom-0
      ${
        sidebar
          ? 'translate-x-0'
          : 'max-sm:translate-x-full'
      }
      transition-all duration-300 ease-in-out`}
    >
      {/* Top Section */}
      <div className='my-7 w-full'>
        {/* User Profile */}
        <div
          onClick={() => openUserProfile()}
          className='flex flex-col items-center cursor-pointer'
        >
          <img
            src={user?.imageUrl}
            alt='User Avatar'
            className='w-16 h-16 rounded-full object-cover'
          />

          <h1 className='mt-2 text-center font-medium text-gray-700'>
            {user?.fullName}
          </h1>
        </div>

        {/* Navigation */}
        <div className='mt-8 space-y-2 px-3'>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded-lg
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-white' : ''
                    }`}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
        <div
          onClick={openUserProfile}
          className='flex gap-2 items-center cursor-pointer'
        >
          <img
            src={user?.imageUrl}
            className='w-8 h-8 rounded-full object-cover'
            alt='profile'
          />

          <div>
            <h1 className='text-sm font-medium'>
              {user?.fullName}
            </h1>

            <p className='text-xs text-gray-500'>
              {plan === 'premium'
                ? 'Premium Plan'
                : 'Free Plan'}
            </p>
          </div>
        </div>

        <LogOut
          onClick={() => signOut()}
          className='w-5 text-gray-400 hover:text-gray-700 transition cursor-pointer'
        />
      </div>
    </div>
  )
}

export default Sidebar