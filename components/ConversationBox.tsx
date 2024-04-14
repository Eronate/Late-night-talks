import { FullConversationType } from '@/app/types'
import Avatar from './Avatar'
import formatLastMessageTime from '@/lib/formatTime'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ConversationBox({
  conversation,
}: {
  conversation: FullConversationType
}) {
  const session = useSession()
  const currUsername = session?.data?.user.username
  const [lastMessage, setLastMesasge] = useState(
    conversation?.messages[conversation.messages.length - 1] || null
  )
  const [lastMesageAt, setLastMessageAt] = useState<Date | null>(
    conversation?.lastMessageAt || conversation.createdAt
  )
  const [title, setTitle] = useState<string | null>()
  const img = useMemo(() => conversation.users[0].image, [conversation.users])
  const lastMessageBody = useMemo(
    () => lastMessage?.body || 'Started a conversation',
    [lastMessage?.body]
  )

  useEffect(() => {
    if (!currUsername) return
    setTitle(() => {
      const otherUsers = conversation.users
        .filter((user) => user.username !== currUsername)
        .map((user) => user.username)
      return otherUsers.join(', ')
    })
  }, [setTitle, currUsername, conversation.users])

  return (
    <Link
      href={`/conversations/${conversation.id}`}
      className="w-full flex shadow-md border-maroonlight border-1 p-3 mt-1 bg-navycustom rounded-xl hover:bg-customcoolcolor hover:transition-colors hover:cursor-pointer"
    >
      <Avatar img={img} />
      <div className="flex ml-2 flex-col justify-start min-w-0 text-ellipsis whitespace-nowrap w-full">
        <div className="text-md text-slate-300">{title}</div>
        <div className="w-full flex flex-row">
          <div className="text-sm text-slate-400 max-w-[70%] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {lastMessageBody}
          </div>
          <div className="pl-3 flex ml-auto self-end text-sm text-slate-500">
            {formatLastMessageTime(lastMesageAt)}
          </div>
        </div>
      </div>
    </Link>
  )
}
