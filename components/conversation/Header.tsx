'use client'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

import Avatar from '../Avatar'
import ProfileDrawer from './components/ProfileDrawer'
import { FullConversationType } from '@/app/types'
import AvatarGroup from './AvatarGroup'
import { Skeleton } from '../ui/skeleton'

export default function Header({
  conversation,
}: {
  conversation: FullConversationType
}) {
  const users = useMemo(() => conversation.users, [conversation.users])
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false)
  const session = useSession()
  const otherUsers = useMemo(() => {
    if (users.length === 0) return []
    else
      return users.filter((user) => user?.email !== session.data?.user?.email)
  }, [users, session?.data?.user])

  if (!session.data)
    return (
      <div className="flex w-full bg-brownish3 p-4 rounded-2xl shadow-md">
        <Skeleton className="w-[40px] h-[40px] bg-gray-500 rounded-full" />
        <div className="pl-3">
          <Skeleton className="w-[80px] h-[16px] bg-gray-500" />
          <Skeleton className="w-[30px] h-[12px] mt-3 bg-gray-500" />
        </div>
        <div className="ml-auto">
          <HiOutlineDotsHorizontal className="h-5 w-5 text-white rounded-full" />
        </div>
      </div>
    )

  return (
    <>
      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        conversation={conversation}
      />
      <div className="flex w-full bg-brownish3 p-4 rounded-2xl shadow-md">
        {conversation.isGroup ? (
          <AvatarGroup users={otherUsers || []} />
        ) : (
          <Avatar img={otherUsers[0]?.image} />
        )}

        <div className="pl-3">
          <p className="text-ellipsis text-white text-md">
            {conversation.name ||
              otherUsers?.map((user) => user.username).join(', ')}
          </p>
          <div className="text-ellipsis text-slate-500 text-xs">Active</div>
        </div>
        <div className="ml-auto">
          <HiOutlineDotsHorizontal
            className="h-5 w-5 text-white cursor-pointer hover:bg-slate-600 transition-colors rounded-full"
            onClick={() => setIsProfileDrawerOpen(true)}
          />
        </div>
      </div>
    </>
  )
}
