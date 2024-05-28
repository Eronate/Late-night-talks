import getConversationByIdWithMessages from '@/app/actions/getConversationByIdWithMessages'
import getConversations from '@/app/actions/getConversations'
import ConversationList from '@/components/ConversationList'
import NavLayout from '@/components/NavLayout'
import ConversationBody from '@/components/conversation/ConversationBody'
import Header from '@/components/conversation/Header'
import TypingInMessageForm from '@/components/conversation/TypingInMessageForm'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ConversationWindow({
  params,
}: {
  params: { conversationId: string }
}) {
  const conversation = await getConversationByIdWithMessages(
    params.conversationId
  )

  const initialConversations = await getConversations()

  if (!initialConversations || !conversation) return redirect('/conversations')

  return (
    <NavLayout isMobileConversationsPage>
      <ConversationList
        initialItems={initialConversations}
        isFromMenu={false}
      />
      <div className="w-full h-full bg-brownish4 p-1 flex-col flex">
        <Header conversation={conversation} />
        <ConversationBody conversation={conversation} />
        <TypingInMessageForm />
      </div>
    </NavLayout>
  )
}
