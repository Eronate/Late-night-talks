import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/libs/prismadb"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { generateUsername } from 'unique-username-generator'
import { User } from "@prisma/client";
import { generateTag } from "@/app/utils/generateTag";

const bcrypt = require('bcrypt')

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

      async profile(profile){
        console.log(profile)
        let username = generateUsername();
        let tag = generateTag();

        let foundDuplicate = await prisma.user.findFirst({
          where: {
            username: username,
            tag: tag
          }
        })
        while(!!foundDuplicate)
        {
            username = generateUsername()
            tag = generateTag()
            foundDuplicate = await prisma.user.findFirst({
              where: {
                username: username,
                tag: tag
              }
            })
        }
        return {
          id: profile.sub,
          email: profile.email,
          username: username,
          image: profile.picture,
          tag: tag
        }
      }
    }),
    CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "email", type: "text"},
          password: { label: "password", type: "password" }
        },
        async authorize(credentials, req) {
          console.log(credentials)
          if(!credentials)
            return null;

          if(!credentials.email || !credentials.password)
            return null;

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            }
          })
          //Checking if user actually has an account with that email, but it's from another provider
          if(!user || !user?.hashedPassword)
            return null;

          const match = await bcrypt.compare(credentials.password, user.hashedPassword)
          console.log(match)
          if(!match)
            return null;
          return user as User;
        }
      }),
    
  ],
  debug: process.env.NODE_ENV === 'development',
  session: 
  {
    strategy: 'jwt'
  },
  callbacks: {
    jwt({token, user}) {
      if (user) {
        token.username = user.username;
        token.id = user.id;
      }
      return token;
    },
    session({session, token}) {
      if(token.username)
        session.user.username = token.username;
      if(token.id)
        session.user.id = token.id;

      return session;
    },
  }
}
export default authOptions