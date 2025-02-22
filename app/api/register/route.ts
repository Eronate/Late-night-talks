import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"
const bcrypt = require('bcrypt')
import * as z from 'zod'
import { registerSchema } from "@/app/types/RegisterType";
import { generateTag } from "@/app/utils/generateTag";
export async function POST(req: Request) {
    const body = await req.json()
    const {
        email,
        username,
        password,
    } = body

    if(!email || !username || !password)
    {
        return NextResponse.json({ error: 'Not all fields were introduced' }, { status: 400 })
    }

    try {
        registerSchema.parse({email, username, password})
    }
    catch(err) {
        return NextResponse.json({ error: 'Fields introduced do not meet the specified requirements'}, { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if(user)
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })

    const hashedPassword = await bcrypt.hash(password, 10)
    let userCreated
    try{
        userCreated = await prisma.user.create({
            data: {
                email,
                username,
                hashedPassword,
                tag: generateTag()
            }
        })
        return NextResponse.json(userCreated);
    }   
    catch(err)
    {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
    
}
