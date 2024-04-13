import { User } from '@prisma/client'
import { create } from 'zustand'

type BearStoreType = {
    incomingRequests: User[] | null,
    sentRequests: User[] | null,
    setIncomingRequests: (incomingRequests: User[] | null) => void,
    setSentRequests: (sentRequests: User[] | null) => void,
    friends: User[] | null, 
    setFriends: (friends: User[] | null) => void,   
} 

const useBearStore = create<BearStoreType>((set) => ({ 
    incomingRequests: [] ,
    sentRequests: [],
    friends: [],
    setIncomingRequests: (incomingRequests) => set({ incomingRequests }),
    setSentRequests: (sentRequests) => set({ sentRequests }),
    setFriends: (friends) => set({ friends }),
}))

export default useBearStore