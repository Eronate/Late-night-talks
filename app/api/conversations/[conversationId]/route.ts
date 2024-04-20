import { prismadb } from "@/app/libs/prismadb"
import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, 
    { params } : {params: {conversationId: string}}
)
{
    
    try {
        const response = await prismadb.conversation.delete({
            where: {
                id: params.conversationId
            }
        })
        if(!response)
            return NextResponse.json("Conversation not found", {status: 404})
        return NextResponse.json(response)
    }
    catch(err)
    {
        console.log(err)
        return NextResponse.json("Error in delete /conversationId", {status: 400})
    }
}