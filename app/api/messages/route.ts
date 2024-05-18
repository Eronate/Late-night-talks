import { prismadb } from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { input, image, conversationId, sender } = body;

    if(!input && !image)
        return NextResponse.json("No input or image sent", { status: 400 });
    if (!conversationId || !sender) {
        return NextResponse.json("Not all fields sent", { status: 400 });
    }
    try{
        const message = await prismadb.message.create({
            data: {
                body: input,
                image: image,
                sender: {
                    connect: {
                        id: sender
                    }
                },
                conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                seen: {
                    connect: {
                        id: sender
                    }
                },
            },
            include: {
                seen: true,
                sender: true,
            }   
        })
        // else message = await prismadb.message.create({
        //     data: {
        //         image: image,
        //         sender: {
        //             connect: {
        //                 id: sender
        //             }
        //         },
        //         conversation: {
        //             connect: {
        //                 id: conversationId
        //             }
        //         },
        //         seen: {
        //             connect: {
        //                 id: sender
        //             }
        //         },
        //     }   
        // })
        
        await pusherServer.trigger(`messages-${conversationId}`, 'new-message', message)

        const updatedConversation = await prismadb.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messageIds: {
                    push: message.id
                }
            },
            include:
            {
                users: true,
                messages: {
                    include: {
                        seen: true,
                    }
                }
            }
        })      

        const allPromises = updatedConversation.users.map( (user) => {
            return pusherServer.trigger(`conversations-list-${user.id}`, 'new-message', message)
        })
        await Promise.all(allPromises)

        return NextResponse.json(message, { status: 200 });
    }
    catch(error)
    {
        console.log(error)
        return NextResponse.json("Error creating message", { status: 400 });
    }
}
