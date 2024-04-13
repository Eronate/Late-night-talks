import { ZodError } from "zod";
import { requestBodySchema } from "../add/route";
import { NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import RemoveBothRequests from "../utils/removeBothRequests";
export async function POST(req: Request) {
    try{
    const response = await RemoveBothRequests(req)
    if(response instanceof NextResponse)
        return response
    const {
        friendRequestIdsFiltered,
        sentFriendRequestIdsFiltered,
        senderId,
        receiverId,
        sender,
        receiver
    } = response

    const receiverUser = await prismadb.user.update({
        where:{
            email: receiver
        },
        data: {
            friendsRequestIds: friendRequestIdsFiltered,
            friendIds: {
                push: senderId
            }
        }
    })

    await prismadb.user.update({
        where:{
            email: sender
        },
        data: {
            sentFriendRequestIds: sentFriendRequestIdsFiltered,
            friendIds: {
                push: receiverId
            }
        }
    })
    return NextResponse.json(receiverUser)
    }
    catch(err) {
        console.log(err)
        return NextResponse.json('Error in add friends', { status: 400 })
    }

}