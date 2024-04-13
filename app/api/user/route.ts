import { prismadb } from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id')
    if(!id)
        return NextResponse.json("No id provided", {status: 400})
    const user = await prismadb.user.findUnique({
        where: {
            id: id
        }
    })
    console.log(user)
    if(!user)
        return NextResponse.json("User not found", {status: 404})
    return NextResponse.json(user)
}