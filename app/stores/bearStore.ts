import { User } from '@prisma/client'
import { create } from 'zustand'
import { MeaningfulUserFields } from '../types'

type BearStoreType = {
    incomingRequests: MeaningfulUserFields[] | null,
    sentRequests: MeaningfulUserFields[] | null,
    setIncomingRequests: (incomingRequests: MeaningfulUserFields[] | null) => void,
    setSentRequests: (sentRequests: MeaningfulUserFields[] | null) => void,
    friends: MeaningfulUserFields[] | null, 
    setFriends: (friends: MeaningfulUserFields[] | null) => void, 
    addToIncomingRequests: (newIncomingReq: MeaningfulUserFields) => void,
    addToSentRequests: (newSentReq: MeaningfulUserFields) => void,
    addToFriends: (newFriend: MeaningfulUserFields) => void,
    removeFromIncomingRequests: (userId: string) => void,
    removeFromSentRequests: (userId: string) => void,  
} 

const useBearStore = create<BearStoreType>((set) => ({ 
    incomingRequests: [] ,
    sentRequests: [],
    friends: [],
    setIncomingRequests: (incomingRequests) => set({ incomingRequests }),
    setSentRequests: (sentRequests) => set({ sentRequests }),
    setFriends: (friends) => set({ friends }),
    addToIncomingRequests: (newIncomingReq: MeaningfulUserFields) => {
        set((state) => {
            if(state.incomingRequests)
                return {
                    incomingRequests: [...state.incomingRequests, newIncomingReq] 
                }
            else return ({incomingRequests: [newIncomingReq]})
        })
    },
    addToSentRequests: (newSentReq: MeaningfulUserFields) => {
        set((state) => {
            if(state.sentRequests)
                return {
                    sentRequests: [...state.sentRequests, newSentReq] 
                }
            else return ({sentRequests: [newSentReq]})
        })
    },
    addToFriends: (newFriend: MeaningfulUserFields) => {
        set((state) => {
            if(state.friends)
                return {
                    friends: [...state.friends, newFriend] 
                }
            else return ({friends: [newFriend]})
        })
    },
    removeFromIncomingRequests: (userId: string) => {
        set((state) => {
            if(state.incomingRequests)
                return {
                    incomingRequests: state.incomingRequests.filter((req) => req.id !== userId)
                }
            else return ({incomingRequests: []})
        })
    },
    removeFromSentRequests: (userId: string) => {
        set((state) => {
            if(state.sentRequests)
                return {
                    sentRequests: state.sentRequests.filter((req) => req.id !== userId)
                }
            else return ({sentRequests: []})
        })
    },           
}))

export default useBearStore