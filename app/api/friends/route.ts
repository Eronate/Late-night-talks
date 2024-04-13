import { prismadb } from "@/app/libs/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try{
        const id = req.nextUrl.searchParams.get('id')
        if(!id) 
            return NextResponse.json("No id provided", {status: 400})
        const response = await prismadb.user.findFirst({
            where: {
                id: id
            },
            select: {
                friends: true
            }
        })
        if(!response)
            return NextResponse.json("User not found", {status: 404})
        return NextResponse.json(response.friends)
    } 
    catch (e) {
        return NextResponse.json("Error in get/friends", {status: 400})
    }
}
