import prisma from "@/app/libs/prismadb"
import { pusherServer } from "@/app/libs/pusher"
import { getMeaningfulUserFields } from "@/app/types"
import { NextResponse } from "next/server"



//Expects the users' ids
export async function POST(req: Request) {
    const body = await req.json()

    const { users, name, isGroup } = body as {users: string[], name: string, isGroup: boolean}
    
    if(users.length < 2)
        return NextResponse.json({error: 'Not enough users'}, {status: 400})

    if(!isGroup)
    {
        const foundConversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { userIds: { equals: [users[0], users[1]] } },
                    { userIds: { equals: [users[1], users[0]] } }
                ]
            }
        });

        if(foundConversation)
            return NextResponse.json(foundConversation)

        else
        {
            try{
                const conversationCreated = await prisma.conversation.create({
                    data: {
                        userIds: users,
                        isGroup: false,
                        name: name
                    },
                    include: {
                        users: true,
                        messages: {
                            include: {
                                seen: true,
                                sender: true
                            }
                        }
                    }
                })

                const conversationPusher = {
                    ...conversationCreated,
                    users: conversationCreated.users.map( (user) => getMeaningfulUserFields(user) ),
                    seen: [],
                    sender: []
                }

                const allPromises = users.map( (user) => { 
                    return pusherServer.trigger(`conversations-list-${user}`, "new-conversation", conversationPusher)
                })
                await Promise.all(allPromises)

                return NextResponse.json(conversationCreated)
            }
            catch(err)
            {
                console.log(err)
                return NextResponse.json({error: 'Could not be created'}, {status: 400})
            }
        }
    }

    try{
        const conversationCreated = await prisma.conversation.create({
            data: {
                userIds: users,
                isGroup: true,
                name: name
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true,
                        sender: true
                    }
                }
            }
        })

        const conversationPusher = {
            ...conversationCreated,
            users: conversationCreated.users.map( (user) => getMeaningfulUserFields(user) ),
            seen: [],
            sender: []
        }
        

        const allPromises = conversationCreated.users.map( (user) => {
            return pusherServer.trigger(`conversations-list-${user.id}`, "new-conversation", 
            conversationPusher)
        })

        await Promise.all(allPromises)
       
        return NextResponse.json(conversationCreated)
    }
    catch(err)
    {
        console.log(err)
        return NextResponse.json({error: 'Could not be created'}, {status: 400})
    }
}
