'use client'
import { FullConversationType, FullMessageType } from '@/app/types'
import ConversationBox from '../ConversationBox'
import { use, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import MessageBox from './components/MessageBox'
import { pusherClient } from '@/app/libs/pusher'

export default function ConversationBody({
  conversation,
}: {
  conversation: FullConversationType
}) {
  const session = useSession()
  const currId = useMemo(() => session?.data?.user.id, [session.data?.user.id])
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState(conversation.messages)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bottomRef])

  useEffect(() => {
    try {
      axios.post(`/api/conversations/${conversation.id}/seen`)

      const channel = pusherClient.subscribe(`messages-${conversation.id}`)
      channel.bind('new-message', (data: FullMessageType) => {
        console.log('Data gotten', data)
        setMessages((prev) => [...prev, data])
      })

      return () => {
        channel.unsubscribe()
        channel.unbind('new-message', (data: FullMessageType) => {
          setMessages((prev) => [...prev, data])
        })
      }
    } catch (err) {
      console.log(err)
    }
  }, [conversation.id])

  if (!currId) return <div>Loading...</div>

  return (
    <div className="flex-grow overflow-y-auto w-full">
      {messages.map((message, index) => {
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
