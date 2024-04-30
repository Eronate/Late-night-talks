import { FullConversationType } from '@/app/types'
import Avatar from './Avatar'
import formatLastMessageTime from '@/lib/formatTime'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import clsx from 'clsx'
import useOtherUserConversation, {
  useOtherUsersConversation,
} from '@/app/hooks/useOtherUserConversation'
import AvatarGroup from './conversation/AvatarGroup'
import { User } from '@prisma/client'

export default function ConversationBox({
  conversation,
}: {
  conversation: FullConversationType
}) {
  const session = useSession()
  const currUsername = session?.data?.user.username
  const currId = session?.data?.user.id
  const [lastMessage, setLastMesasge] = useState(
    conversation?.messages[conversation.messages.length - 1] || null
  )
  const [lastMesageAt, setLastMessageAt] = useState<Date | null>(
    conversation?.lastMessageAt || conversation.createdAt
  )
  const [title, setTitle] = useState<string | null>()

  const otherUser = useOtherUserConversation(conversation)

  const img = useMemo(() => otherUser?.image, [otherUser])

  const lastMessageBody = useMemo(() => {
    if (lastMessage?.image) return 'Sent an image'
    else return lastMessage?.body || 'Started a conversation'
  }, [lastMessage])

  const otherUsers: User[] | null = useOtherUsersConversation(conversation)

  useEffect(() => {
    if (!currId || !otherUsers) return
    setTitle(() => {
      if (conversation.name) return conversation.name
      const names = otherUsers.map((user) => user.username)
      return names.join(', ')
    })
  }, [setTitle, currId, conversation, otherUsers])

  if (!session.data?.user.id) return <></>

  const textStyle = clsx(
    `
    text-xs text-slate-400 max-w-[70%] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap
  `,
    !lastMessage?.seenIds.includes(session.data!.user.id)
      ? 'font-semibold text-slate-200'
      : ''
  )

  return (
    <Link
      href={`/conversations/${conversation.id}`}
      className="w-full flex shadow-md border-maroonlight border-1 p-3 mt-1 bg-navycustom rounded-xl hover:bg-customcoolcolor hover:transition-colors hover:cursor-pointer"
    >
      {conversation.isGroup ? (
        <AvatarGroup users={otherUsers || []} />
      ) : (
        <Avatar img={img} />
      )}
      <div className="flex ml-2 flex-col justify-start min-w-0 text-ellipsis whitespace-nowrap w-full">
        <div className="text-md text-slate-300">{title}</div>
        <div className="w-full flex flex-row">
          <div className={textStyle}>{lastMessageBody}</div>
          <div className="pl-3 flex ml-auto self-end text-xs text-slate-500">
            {formatLastMessageTime(lastMesageAt)}
          </div>
        </div>
      </div>
    </Link>
  )
}
