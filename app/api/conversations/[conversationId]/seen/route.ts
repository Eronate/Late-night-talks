import { prismadb } from "@/app/libs/prismadb"
import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import { pusherServer } from "@/app/libs/pusher"
import { getMeaningfulUserFields } from "@/app/types"
export async function POST(req: Request, 
    { params } : {params: {conversationId?: string}}
) {
    try{
        const user = await getCurrentUser()
        if(!user)
            return NextResponse.json("User unauthenticated", {status: 404})
        const { conversationId } = params
        if(!conversationId)
            return NextResponse.json("No conversationId provided", {status: 400})
        
        const conversation = await prismadb.conversation.findUnique({
            where: {
                id: conversationId
            },
            select: {
                messages: true,
                users: true
            }
        })
        
        if(!conversation)
            return NextResponse.json("Conversation not found", {status: 404})
        if(conversation.messages.length === 0)
            return NextResponse.json("No messages in conversation", {status: 200})
        const lastMessage = conversation.messages[conversation.messages.length - 1]
        
        const messageSeen = await prismadb.message.update({
            where: {
                id: lastMessage.id
            },
            data: {
                seen: {
                    connect: {
                        id: user.id
                    }
                },
            },
            include: {
                seen: true
            }
        })
    
        if(!messageSeen)
            return NextResponse.json("Message not found", {status: 404})
        const pusherMssageSeen = {
            ...messageSeen,
            seen: messageSeen.seen.map( (user) => getMeaningfulUserFields(user) )
        }
        await pusherServer.trigger(`messages-${conversationId}`, "seen-message", pusherMssageSeen)

        const allPromises = conversation.users.map( (user) => { 
            return pusherServer.trigger(`conversations-list-${user.id}`, "seen-message", pusherMssageSeen)
        })
        
        await Promise.all(allPromises)

        return NextResponse.json(messageSeen)
    }
    catch(err)
    {
        return NextResponse.json("Error in post /seen", {status: 400})
    }
}