import getConversationByIdWithMessages from '@/app/actions/getConversationByIdWithMessages'
import { FullConversationType } from '@/app/types'
import ConversationBody from '@/components/conversation/ConversationBody'
import Header from '@/components/conversation/Header'
import TypingInMessageForm from '@/components/conversation/TypingInMessageForm'

export default async function ConversationWindow({
  params,
}: {
  params: { id: string }
}) {
  const conversation = await getConversationByIdWithMessages(params.id)

  if (!conversation) return <div>Loading...</div>

  return (
    <div>
      <Header />
      <ConversationBody />
      <TypingInMessageForm />
    </div>
  )
}
