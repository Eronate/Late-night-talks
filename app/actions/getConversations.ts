import { Conversation } from "@prisma/client";
import { prismadb } from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser"

const getConversations = async () => {
    const currentUser = await getCurrentUser()
    if(!currentUser?.id)
        return null

    try{
        const conversations = await prismadb.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc'
            },
            where: {
                userIds: {
                    has: currentUser.id
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true
                    }
                }
            }
        })
        return conversations
    }
    catch(err){
        console.log(err)
        return []
    }           
}

export default getConversations;