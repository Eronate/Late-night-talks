import { prismadb } from "@/app/libs/prismadb"
import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
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
                messages: true
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
                }
            }
        })
        return NextResponse.json(messageSeen)
    }
    catch(err)
    {
        return NextResponse.json("Error in post /seen", {status: 400})
    }
}