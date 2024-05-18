'use client'
import getConversations from '@/app/actions/getConversations'
import { FullConversationType, FullMessageType } from '@/app/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MdGroupAdd } from 'react-icons/md'
import ConversationBox from './ConversationBox'
import Self from './Self'
import GroupChatAddModal from './conversation/GroupChatAddModal'
import { pusherClient } from '@/app/libs/pusher'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'

export default function ConversationList({
  initialItems,
}: {
  initialItems: FullConversationType[]
}) {
  const [conversations, setConversations] = useState(initialItems)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const session = useSession()
  const currUser = session.data?.user

  useEffect(() => {
    if (!currUser) return
    const channel = pusherClient.subscribe(`conversations-list-${currUser.id}`)

    const newMessageHandler = (lastSentMessage: FullMessageType) => {
      console.log('In da handla', lastSentMessage)
      setConversations((prev) => {
        return prev.map((item) => {
          if (item.id !== lastSentMessage.conversationId) {
            return item
          }
          return {
            ...item,
            messages: [...item.messages, lastSentMessage],
            lastMessageAt: lastSentMessage.createdAt,
          }
        })
      })
    }
    const newConversationHandler = (conversation: FullConversationType) => {
      setConversations((prev) => [...prev, conversation])
    }

    const deletedConversationHandler = (id: string) => {
      setConversations((prev) => {
        return prev.filter((item) => item.id !== id)
      })
    }

    const seenMessageHandler = (
      message: FullMessageType & { seen: User[] }
    ) => {
      setConversations((prev) => {
        console.log('Trying to set new seen')
        return prev.map((item) => {
          if (item.id !== message.conversationId) {
            return item
          }
          return {
            ...item,
            messages: item.messages.map((msg) => {
              if (msg.id !== message.id) {
                return msg
              }
              return {
                ...msg,
                seen: message.seen,
                seenIds: message.seenIds,
              }
            }),
          }
        })
      })
    }

    channel.bind('new-message', newMessageHandler)
    channel.bind('new-conversation', newConversationHandler)
    channel.bind('deleted-conversation', deletedConversationHandler)
    channel.bind('seen-message', seenMessageHandler)

    return () => {
      pusherClient.unsubscribe(`conversations-list-${currUser.id}`)
      channel.unbind('new-message', newMessageHandler)
      channel.unbind('new-conversation', newConversationHandler)
      channel.unbind('deleted-conversation', deletedConversationHandler)
    }
  }, [setConversations, currUser])

  //loading skeleton
  if (!conversations) return <div>Loading...</div>

  return (
    <>
      <GroupChatAddModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      <div className="sm:flex flex-col bg-navycustom hidden">
        <div className="flex items-center">
          <div className="text-xl text-slate-300 p-4 text-start">
            Conversations
          </div>
          <div onClick={() => setIsModalOpen(true)} className="ml-auto mr-2">
            <MdGroupAdd className="ml-auto w-10 h-10 hover:cursor-pointer text-slate-500 p-1 rounded-full transition-colors hover:bg-slate-300 hover:bg-opacity-20" />
          </div>
        </div>

        <div className="pt-2 pl-2 pr-2 overflow-y-auto sm:w-[260px] lg:w-[384px]  shadow-lg">
          {conversations.map((conversation, index) => (
            <ConversationBox key={index} conversation={conversation} />
          ))}
        </div>
        <div className="mt-auto pb-12 sm:pb-0">
          <Self />
        </div>
      </div>
    </>
  )
}
