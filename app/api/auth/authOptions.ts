import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/libs/prismadb"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
const bcrypt = require('bcrypt')

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
          return user;
        }
      }),
    
  ],
  debug: process.env.NODE_ENV === 'development',
  session: 
  {
    strategy: 'jwt'
  }
}
export default authOptions