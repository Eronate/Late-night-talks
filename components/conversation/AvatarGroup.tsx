'use client'

import { MeaningfulUserFields } from '@/app/types'
import Image from 'next/image'

interface AvatarGroupProps {
  users?: MeaningfulUserFields[]
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }) => {
  const slicedUsers = users.slice(0, 3)

  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0',
  }

  return (
    <div
      className="
        relative
        h-11
        w-11
      "
    >
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={`
            absolute
            inline-block
            rounded-full
            overflow-hidden
            h-[20px]
            w-[20px]
            ${positionMap[index as keyof typeof positionMap]}
          `}
        >
          <img alt="Avatar" src={user?.image || '/gengar.jpg'} />
        </div>
      ))}
    </div>
  )
}

export default AvatarGroup
