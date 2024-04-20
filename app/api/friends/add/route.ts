import prisma from "@/app/libs/prismadb"
import { NextResponse } from "next/server";
import * as z from 'zod'

export const requestBodySchema = z.object({
  sender: z.string(),
  receiver: z.string(),
});

export async function POST(req: Request) {
    const body = await req.json()
    const { sender, receiver } = requestBodySchema.parse(body)

    if(!sender || !receiver)
        return Response.json({ error: 'Error in add friends' }, { status: 400 })

    const foundRequester = await prisma.user.findUnique({
        where: {
            id: sender
        },
    })
    if(!foundRequester)
        return Response.json({ error: 'First user not found' }, { status: 400 })

    const foundReceiver = await prisma.user.findUnique({
        where: {
            id: receiver
        },
    })

    const foundSender = await prisma.user.findUnique({
        where: {
            id: sender
        },
    })
    if(!foundSender)
        return Response.json({ error: 'Sender not found' }, { status: 400 })

    if(!foundReceiver)
        return Response.json({ error: 'Receiver not found' }, { status: 400 })

    if(foundReceiver.friendsRequestIds.includes(sender))
        return Response.json({ error: 'You have already sent a friend request to this user' }, { status: 201 })

    if(foundReceiver.sentFriendRequestIds.includes(sender))
        return Response.json({ error: 'You have a pending friend request from this user' }, { status: 201 })

    if(foundReceiver.friendIds.includes(foundRequester.id))
        return Response.json({ error: 'You are already friends with this user!' }, { status: 201 })

    const sendFriendRequestToReceiver = await prisma.user.update({
        where: {
            id: receiver
        },
        data: {
            friendsRequestIds: {
                push: sender
            }
        },
        include: {
            friendsRequest: true
        }
    })

    const addRequestToPendingForSender = await prisma.user.update({
        where: {
            id: sender
        },
        data: {
            sentFriendRequestIds: {
                push: receiver
            }
        },
        include: {
            sentFriendRequest: true
        }
    })

    if(!sendFriendRequestToReceiver || !addRequestToPendingForSender)
        return Response.json({ error: 'Error in sending friend request' }, { status: 400 })

    // console.log("Friends request sent:", {sendFriendRequestToReceiver})
    // console.log("Friends request awaiting:", {addRequestToPendingForSender})
    return NextResponse.json(sendFriendRequestToReceiver)
}   