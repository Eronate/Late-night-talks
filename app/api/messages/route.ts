import { prismadb } from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { input, image, conversationId, sender } = body;
    console.log(input, conversationId, sender)
    if(!input && !image)
        return NextResponse.json("No input or image sent", { status: 400 });
    if (!conversationId || !sender) {
        return NextResponse.json("Not all fields sent", { status: 400 });
    }
    try{
        let message
        if(input)
            message = await prismadb.message.create({
                data: {
                    body: input,
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
                }   
            })
        else message = await prismadb.message.create({
            data: {
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
            }   
        })

        const updatedConveersation = await prismadb.conversation.update({
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

        return NextResponse.json(message, { status: 200 });
    }
    catch(error)
    {
        console.log(error)
        return NextResponse.json("Error creating message", { status: 400 });
    }
}
