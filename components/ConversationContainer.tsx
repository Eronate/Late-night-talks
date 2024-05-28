'use client'

import useConversation from '@/app/hooks/useConversation'
import { Meteors } from './ui/meteors'
import { SparklesCore } from './ui/sparkles'

export default function ConversationContainer() {
  return (
    <div className="relative sm:flex italic bg-black hidden w-full bg-black h-full justify-center items-center text-slate-500">
      <div className="w-full h-full">
        <SparklesCore
          background="transparent"
          maxSize={0.2}
          speed={0.0001}
          particleDensity={75}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="absolute top-1/2 left-1/3 text-slate-700 text-4xl font-semibold">
        Start a conversation
      </div>
    </div>
  )
}
