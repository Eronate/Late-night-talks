import { prismadb } from "@/app/libs/prismadb"
import { requestBodySchema } from "../add/route"
import { NextResponse } from "next/server"

export default async function RemoveBothRequests(req: Request) {
    try
    {
        const body = await req.json()
        const { sender, receiver } = requestBodySchema.parse(body)
        // console.log({sender, receiver})
        const senderSentFriendRequestResponse = await prismadb.user.findFirst({
            where: {
                email: sender
            },
            select: {
                sentFriendRequestIds: true,
                id: true
            }
        })
        if(!senderSentFriendRequestResponse)
            return NextResponse.json('Sender not found', { status: 404 })
        
        const receiverSentFriendRequestResponse = await prismadb.user.findFirst({
            where: {
                email: receiver
            },
            select: {
                friendsRequestIds: true,
                id: true
            }
        })
        if(!receiverSentFriendRequestResponse)
            return NextResponse.json('Receiver not found', { status: 404 })
        
        const { sentFriendRequestIds, id: senderId } = senderSentFriendRequestResponse

        const { friendsRequestIds, id: receiverId } = receiverSentFriendRequestResponse

        const sentFriendRequestIdsFiltered = 
            sentFriendRequestIds.filter((id) => id !== receiverId)


        const friendRequestIdsFiltered = 
            friendsRequestIds.filter((id) => id !== senderId)

        return {
            friendRequestIdsFiltered,
            sentFriendRequestIdsFiltered,
            senderId,
            receiverId,
            sender,
            receiver
        }
    }
    catch(err) {
        return NextResponse.json('Error removeBothRequests.ts', { status: 500 })
    }
}
