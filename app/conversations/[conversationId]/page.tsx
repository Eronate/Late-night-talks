import getConversationByIdWithMessages from '@/app/actions/getConversationByIdWithMessages'
import { FullConversationType } from '@/app/types'
import ConversationBody from '@/components/conversation/ConversationBody'
import Header from '@/components/conversation/Header'
import TypingInMessageForm from '@/components/conversation/TypingInMessageForm'
import { useMemo } from 'react'

export default async function ConversationWindow({
  params,
}: {
  params: { conversationId: string }
}) {
  const conversation = await getConversationByIdWithMessages(
    params.conversationId
  )

  if (!conversation) return <div>Loading...</div>
  return (
    <div className="w-full h-full bg-brownish4 p-1 flex-col flex">
      <Header conversation={conversation} />
      <ConversationBody conversation={conversation} />
      <TypingInMessageForm />
    </div>
  )
}
