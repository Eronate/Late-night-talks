import { ZodError } from "zod";
import { NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import RemoveBothRequests from "../utils/removeBothRequests";
import { pusherServer } from "@/app/libs/pusher";
import { getMeaningfulUserFields } from "@/app/types";

export async function POST(req: Request) {
    try{
        const response = await RemoveBothRequests(req)

        if(response instanceof NextResponse)
            return response
        const {
            friendRequestIdsFiltered,
            sentFriendRequestIdsFiltered,
            sender,
            receiver
        } = response

        const senderUpdated = await prismadb.user.update({
            where:{
                email: sender
            },
            data: {
                sentFriendRequestIds: sentFriendRequestIdsFiltered
            },
            select: {
                id: true
            }
        })
    
        const receiverUpdated = await prismadb.user.update({
            where:{
                email: receiver
            },
            data: {
                friendsRequestIds: friendRequestIdsFiltered
            }
        }) 

        const pusherReceiver = getMeaningfulUserFields(receiverUpdated)

        await pusherServer.trigger(`friend-requests-${senderUpdated.id}`, 'sent-request-rejected', pusherReceiver )
        
        return NextResponse.json('Friend request rejected', { status: 200 })
    }
    catch(err)
    {
        if(err instanceof ZodError)
            return NextResponse.json('Wrong request format, should be {sender: string, receiver: string}', { status: 400 })
        return NextResponse.json('Error in add friends', { status: 400 })
    }

}