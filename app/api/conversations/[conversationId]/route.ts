import { prismadb } from "@/app/libs/prismadb"
import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import { pusherServer } from "@/app/libs/pusher"

export async function DELETE(req: Request, 
    { params } : {params: {conversationId: string}}
)
{
    try {
        const response = await prismadb.conversation.delete({
            where: {
                id: params.conversationId
            },
            include: {
                users: true
            }
        })

        if(!response)
            return NextResponse.json("Conversation not found", {status: 404})
        
        const allPromises = response.users.map( (user) => {
            return pusherServer.trigger(`conversations-list-${user.id}`, "deleted-conversation", response.id)
        })

        await Promise.all(allPromises)

      
        return NextResponse.json(response)
    }
    catch(err)
    {
        console.log(err)
        return NextResponse.json("Error in delete /conversationId", {status: 400})
    }
}