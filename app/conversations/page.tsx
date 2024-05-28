import ConversationContainer from '@/components/ConversationContainer'
import NavLayout from '@/components/NavLayout'
import ConversationList from '@/components/ConversationList'
import getConversations from '../actions/getConversations'

const Home = async () => {
  // const { isOpen } = useConversation()
  const initialConversations = await getConversations()
  if (!initialConversations) return <div>Loading...</div>
  return (
    <NavLayout>
      <ConversationList initialItems={initialConversations} isFromMenu />
      <ConversationContainer />
    </NavLayout>
  )
}

export default Home
