'use client'
import getConversations from '@/app/actions/getConversations'
import { FullConversationType } from '@/app/types'
import { useState } from 'react'

export default function ConversationList({
  initialItems,
}: {
  initialItems: FullConversationType[]
}) {
  const [conversations, setConversations] = useState(initialItems)

  if (!conversations) return <div>Loading...</div>

  return (
    <div>
      {conversations.map((conversation, index) => (
        <div key={index}>
          {conversation.users.map((usr, i) => (
            <p key={i}>{usr.username}</p>
          ))}
        </div>
      ))}
    </div>
  )
}
