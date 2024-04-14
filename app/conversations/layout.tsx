import ConversationList from '@/components/ConversationList'
import NavLayout from '@/components/NavLayout'
import getConversations from '../actions/getConversations'

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialConversations = await getConversations()
  if (!initialConversations) return <div>Loading...</div>
  return (
    <NavLayout>
      <ConversationList initialItems={initialConversations} />
      {children}
    </NavLayout>
  )
}
