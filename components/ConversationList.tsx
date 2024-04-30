'use client'
import getConversations from '@/app/actions/getConversations'
import { FullConversationType } from '@/app/types'
import { useCallback, useMemo, useState } from 'react'
import { MdGroupAdd } from 'react-icons/md'
import ConversationBox from './ConversationBox'
import Self from './Self'
import GroupChatAddModal from './conversation/GroupChatAddModal'

export default function ConversationList({
  initialItems,
}: {
  initialItems: FullConversationType[]
}) {
  const [conversations, setConversations] = useState(initialItems)
  const [isModalOpen, setIsModalOpen] = useState(false)
  console.log(conversations)
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

        <div className="pt-2 pl-2 pr-2 overflow-y-auto min-w-max shadow-lg">
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
