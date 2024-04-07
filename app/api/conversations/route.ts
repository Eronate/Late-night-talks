import prisma from "@/app/libs/prismadb"
import { NextResponse } from "next/server"

//Expects the users' emails 
export async function POST(req: Request) {
    const body = await req.json()
    //Only the emails were sent
    console.log(body)
    const { users } = body as {users: string[]}
    if(!users)
        return NextResponse.json({error: 'Users field not in request'}, {status: 400})
    
    const usersArr = users.map(async (email: string) => {
        const userId = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if(!userId)
            return null
        return userId
    })
    const usersArrResolved = await Promise.all(usersArr)

    if(usersArrResolved.includes(null))
        return NextResponse.json({error: 'Not all users were found'}, {status: 400})
   
    const userIdsResolved = usersArrResolved.map(user => user!.id)


    const conversationQuery = await prisma.conversation.findFirst({
        where: {
            userIds: {
                hasEvery: userIdsResolved,
            },
        },
    })
    if(conversationQuery)
        return NextResponse.json(conversationQuery)

    try{
        const conversationCreated = await prisma.conversation.create({
            data: {
                userIds: userIdsResolved,
                isGroup: userIdsResolved.length > 2
            },
            include: {
                users: true
            }
        })
        return NextResponse.json(conversationCreated)
    }
    catch(err)
    {
        console.log(err)
        return NextResponse.json({error: 'Could not be created'}, {status: 400})
    }
}
