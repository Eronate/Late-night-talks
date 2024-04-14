'use client'

import clsx from 'clsx'

import useConversation from '../hooks/useConversation'

import ConversationContainer from '@/components/ConversationContainer'

const Home = () => {
  const { isOpen } = useConversation()

  return <ConversationContainer />
}

export default Home
