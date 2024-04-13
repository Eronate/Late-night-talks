'use client'
import useSelf from '@/app/hooks/useSelf'
import UserBox from './UserBox'

export default function Self() {
  const self = useSelf()
  console.log('Self', self)
  if (!self) return <></>
  return (
    <div className="w-full flex shadow-md bg-customcoolcolor border-maroonlight border-1 p-3 mt-1">
      <div className="flex">
        <div className="w-max relative h-max shadow-xl rounded-full">
          <img
            src={self.image || '/gengar.jpg'}
            className="w-auto h-full max-h-28"
          />
          <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 ring-navycustom ring-4 z-50 rounded-full" />
        </div>
      </div>
      <div className="flex ml-2 flex-col justify-start min-w-0 text-ellipsis whitespace-nowrap w-full">
        <div className="text-2xl text-slate-300">{self.username}</div>
        <div className="w-full flex flex-row">
          <div className="text-lg text-slate-400 max-w-[70%] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {self.status}
          </div>
        </div>
      </div>
    </div>
  )
}
