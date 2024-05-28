import useActiveList from '@/app/hooks/useActiveList'
import { useSession } from 'next-auth/react'
import { Skeleton } from './ui/skeleton'

export default function Avatar({
  img,
  userEmail,
}: {
  img: string | null | undefined
  userEmail: string
}) {
  const { members } = useActiveList()

  const isActive = members.indexOf(userEmail) !== -1

  return (
    <div className="flex">
      <div className="w-max relative h-max shadow-xl rounded-full">
        <img src={img || '/gengar.jpg'} className="w-10 h-10 rounded-full" />

        {isActive && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 ring-navycustom ring-4 z-50 rounded-full" />
        )}
      </div>
    </div>
  )
}
