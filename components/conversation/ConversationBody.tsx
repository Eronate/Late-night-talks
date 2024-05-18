'use client'
import { FullConversationType, FullMessageType } from '@/app/types'
import ConversationBox from '../ConversationBox'
import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import MessageBox from './components/MessageBox'
import { pusherClient } from '@/app/libs/pusher'
import { Message, User } from '@prisma/client'

export default function ConversationBody({
  conversation,
}: {
  conversation: FullConversationType
}) {
  const session = useSession()
  const currId = useMemo(() => session?.data?.user.id, [session.data?.user.id])
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollableRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState(conversation.messages)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (messages && bottomRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = bottomRef.current
      if (Math.abs(scrollHeight - clientHeight - scrollTop) <= 1) {
        scrollToBottom()
      }
    }
  }, [])

  useEffect(() => {
    try {
      axios.post(`/api/conversations/${conversation.id}/seen`)

      const channel = pusherClient.subscribe(`messages-${conversation.id}`)
      const newMessageHandler = (data: FullMessageType) => {
        console.log('Data gotten', data)
        setMessages((prev) => [...prev, data])
      }

      const seenMessageHandler = (data: Message & { seen: User[] }) => {
        console.log('Data gotten seen', data)
        setMessages((prev) => {
          const messagesUpdated = prev.slice(0, prev.length - 1).concat({
            ...prev[prev.length - 1],
            seen: data.seen,
            seenIds: data.seenIds,
          })
          console.log('Message updated', messagesUpdated)
          return messagesUpdated
        })
      }

      channel.bind('seen-message', seenMessageHandler)
      channel.bind('new-message', newMessageHandler)

      return () => {
        channel.unbind('new-message', newMessageHandler)
        channel.unbind('seen-message', seenMessageHandler)
        pusherClient.unsubscribe(`messages-${conversation.id}`)
      }
    } catch (err) {
      console.log(err)
    }
  }, [conversation.id])

  const handleScroll = useCallback(
    (e: Event) => {
      const target = e.target as HTMLDivElement
      const bottom =
        Math.abs(
          target.scrollHeight - target.scrollTop - target.clientHeight
        ) <= 1

      if (bottom && currId) {
        if (
          messages.length > 0 &&
          !(currId in messages[messages.length - 1].seenIds)
        ) {
          axios.post(`/api/conversations/${conversation.id}/seen`)
        }
      }
    },
    [conversation.id, currId, messages]
  )

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.addEventListener('scroll', handleScroll)
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      if (scrollableRef.current) {
        scrollableRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [scrollableRef, conversation.id, handleScroll])

  return (
    <div className="flex-grow overflow-y-auto w-full" ref={scrollableRef}>
      {messages.map((message, index) => {
        return (
          <MessageBox
            key={index}
            message={message}
            currId={currId}
            isLast={index === messages.length - 1}
          />
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
