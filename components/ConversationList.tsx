'use client'
import getConversations from '@/app/actions/getConversations'
import { FullConversationType } from '@/app/types'
import { useCallback, useMemo, useState } from 'react'
import ConversationBox from './ConversationBox'
import Self from './Self'

export default function ConversationList({
  initialItems,
}: {
  initialItems: FullConversationType[]
}) {
  const [conversations, setConversations] = useState(initialItems)

  if (!conversations) return <div>Loading...</div>

  return (
    <div className="sm:flex flex-col bg-navycustom hidden">
      <div className="text-xl text-slate-300 p-2 text-center">
        Conversations
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
  )
}
