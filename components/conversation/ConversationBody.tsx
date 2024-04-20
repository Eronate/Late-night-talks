'use client'
import { FullConversationType } from '@/app/types'
import ConversationBox from '../ConversationBox'
import { use, useEffect, useMemo, useRef } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import MessageBox from './components/MessageBox'

export default function ConversationBody({
  conversation,
}: {
  conversation: FullConversationType
}) {
  const session = useSession()
  const currId = useMemo(() => session?.data?.user.id, [session.data?.user.id])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bottomRef])

  useEffect(() => {
    try {
      axios.post(`/api/conversations/${conversation.id}/seen`)
    } catch (err) {
      console.log(err)
    }
  }, [conversation.id])

  if (!currId) return <div>Loading...</div>

  return (
    <div className="flex-grow overflow-y-auto w-full">
      {conversation.messages.map((message, index) => {
        return (
          <MessageBox
            key={index}
            message={message}
            currId={currId}
            isLast={index === conversation.messages.length - 1}
          />
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
