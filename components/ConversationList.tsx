'use client'
import getConversations from '@/app/actions/getConversations'
import { FullConversationType, FullMessageType } from '@/app/types'
import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import { MdGroupAdd } from 'react-icons/md'
import ConversationBox from './ConversationBox'
import Self from './Self'
import GroupChatAddModal from './conversation/GroupChatAddModal'
import { pusherClient } from '@/app/libs/pusher'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Router } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import Button from './Button'
import clsx from 'clsx'

export default function ConversationList({
  initialItems,
  isFromMenu = false,
}: {
  initialItems: FullConversationType[]
  isFromMenu?: boolean
}) {
  const [conversations, setConversations] = useState(initialItems)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false)

  const session = useSession()
  const currUser = session.data?.user
  const params = useParams()
  // const router = useRouter()
  // const pathname = usePathname()
  useEffect(() => {
    if (!currUser) return
    const channel = pusherClient.subscribe(`conversations-list-${currUser.id}`)

    const newMessageHandler = (lastSentMessage: FullMessageType) => {
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
      console.log('new conv handler', conversation)
      setConversations((prev) => [...prev, conversation])
    }

    const deletedConversationHandler = (id: string) => {
      setConversations((prev) => {
        return prev.filter((item) => item.id !== id)
      })
      if (params && params.conversationId === id) setIsDeletedModalOpen(true)
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

  const styleForMenu = clsx(
    `
    flex-col bg-navycustom w-full sm:w-max
  `,
    isFromMenu ? 'flex' : 'sm:flex hidden'
  )

  return (
    <>
      <GroupChatAddModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      <ConversationDeletedNotificationModal
        isOpen={isDeletedModalOpen}
        setIsOpen={setIsDeletedModalOpen}
      />
      <div className={styleForMenu}>
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

interface ConversationDeletedNotificationModal {
  isOpen: boolean
  setIsOpen: Dispatch<React.SetStateAction<boolean>>
}

const ConversationDeletedNotificationModal = ({
  isOpen,
  setIsOpen,
}: ConversationDeletedNotificationModal) => {
  const router = useRouter()

  const handleConfirm = () => {
    router.push('/conversations')
    setIsOpen(false)
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="shadow-2xl ring-1 ring-black mx-auto max-w-96 bg-navycustom rounded-lg p-4 text-center text-lg text-slate-300 gap-7 flex flex-col">
          <Dialog.Title>
            <div className="font-semibold">
              The current conversation has been deleted by one of the users
            </div>
          </Dialog.Title>
          <div className="flex gap-4 ml-auto">
            <Button
              variant="danger"
              className="ml-auto"
              onClick={handleConfirm}
            >
              Understood
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
