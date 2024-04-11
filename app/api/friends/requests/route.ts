import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id')
    if(!id) 
        return NextResponse.json({ status: 400, body: { message: 'No id provided' } })
    const friendRequests = await prisma.user.findFirst({
        where: {
            id: id
        },
        select: {
            friendsRequest: true,
            sentFriendRequest: true
        }
    })
    return NextResponse.json(friendRequests)
}