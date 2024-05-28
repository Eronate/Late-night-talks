'use client'
import { FullConversationType, FullMessageType } from '@/app/types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import MessageBox from './components/MessageBox'
import { pusherClient } from '@/app/libs/pusher'
import { Message, User } from '@prisma/client'

const overflownLeverage = 300
const normalLeverage = 10

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

  function isOverflown(element: HTMLDivElement) {
    return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    )
  }

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  const checkIfBottomAndScroll = useCallback(() => {
    if (messages && scrollableRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = scrollableRef.current
      if (
        Math.abs(scrollHeight - clientHeight - scrollTop) <=
          overflownLeverage &&
        isOverflown(scrollableRef.current)
      ) {
        scrollToBottom()
      } else {
        if (
          currId &&
          messages.length > 0 &&
          !isOverflown(scrollableRef.current) &&
          !messages[messages.length - 1].seenIds.includes(currId)
        ) {
          axios.post(`/api/conversations/${conversation.id}/seen`)
        }
      }
    }
  }, [messages, scrollToBottom, currId, conversation.id, scrollableRef])

  useEffect(() => {
    checkIfBottomAndScroll()
  }, [messages, checkIfBottomAndScroll])

  // useEffect(() => {
  //   const checkIfVisible = async () => {
  //     if (!scrollableRef.current || !bottomRef.current) return
  //     const isVisible = await isVisibleFnc(
  //       bottomRef.current,
  //       scrollableRef.current
  //     )
  //     if (
  //       currId &&
  //       isVisible &&
  //       !messages[messages.length - 1].seenIds.includes(currId)
  //     ) {
  //       axios.post(`/api/conversations/${conversation.id}/seen`)
  //     }
  //   }
  //   checkIfVisible()
  // }, [messages, conversation.id, bottomRef, currId, scrollableRef])

  useEffect(() => {
    try {
      axios.post(`/api/conversations/${conversation.id}/seen`)

      const channel = pusherClient.subscribe(`messages-${conversation.id}`)
      const newMessageHandler = (data: FullMessageType) => {
        console.log('Data gotten', data)
        setMessages((prev) => [...prev, data])
        // if (
        //   scrollableRef.current &&
        //   scrollableRef.current.scrollHeight <=
        //     scrollableRef.current.scrollTop + scrollableRef.current.clientHeight
        // )
        //   axios.post(`/api/conversations/${conversation.id}/seen`)
      }

      const seenMessageHandler = (data: FullMessageType) => {
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
        target.scrollHeight - target.scrollTop - target.clientHeight <
        normalLeverage

      if (bottom && currId) {
        if (
          messages.length > 0 &&
          !messages[messages.length - 1].seenIds.includes(currId)
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
