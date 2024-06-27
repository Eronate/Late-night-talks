'use client'
import getCurrentSession from '@/app/utils/getCurrentSession'
import { Conversation, User } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { EventHandler, MouseEvent } from 'react'
import Avatar from './Avatar'
import { MeaningfulUserFields } from '@/app/types'

export default function UserBox({ user }: { user: MeaningfulUserFields }) {
  const router = useRouter()
  const session = useSession()

  const handleClick = async (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    user: MeaningfulUserFields
  ) => {
    if (!session.data) return null
    const response = await axios.post('/api/conversations/', {
      users: [session?.data.user?.id, user.id],
      isGroup: false,
    })
    const conversation: Conversation | null = response.data
    if (!conversation) return null
    router.push(`/conversations/${conversation.id}`)
  }

  return (
    <div
      onClick={(e) => handleClick(e, user)}
      className="w-full flex shadow-md border-maroonlight border-1 p-3 mt-1 bg-navycustom rounded-xl hover:bg-customcoolcolor hover:transition-colors hover:cursor-pointer"
    >
      <Avatar img={user.image} userEmail={user.email!} />
      <div className="flex ml-2 flex-col justify-start min-w-0 text-ellipsis whitespace-nowrap w-full">
        <div className="text-md text-slate-300">{user.username}</div>
        <div className="w-full flex flex-row">
          <div className="text-sm text-slate-400 max-w-[70%] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {user.status}
          </div>
          {/* <div className="flex ml-auto self-end text-sm text-slate-500">
            7:00 PM
          </div> */}
        </div>
      </div>
    </div>
  )
}
