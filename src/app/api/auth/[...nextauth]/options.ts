import Credentials from "next-auth/providers/credentials"
import dbConnect from "@/lib/dbConnect"
import { NextAuthOptions } from "next-auth"
import UserModel from "@/model/User";
import bcrypt from "bcrypt"


export const nextAuthOptions :NextAuthOptions = {
    providers: [
        Credentials({
            name: 'Credentials',
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
            email: { label: "email", type: "email"},
            password: { label: "Password", type: "password" }
            },
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            async authorize(credentials: any):Promise<any> {
                dbConnect();

                try {
                    const user= await UserModel.findOne({
                        $or:[
                            {email: credentials?.email},
                            {username:credentials?.email}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    if(!user?.isVerified){
                        throw new Error('Please verify your account before logging in');
                    }

                    const isPssswordCorrect= await bcrypt.compare(credentials?.password, user?.password )

                    if(isPssswordCorrect){
                        return user
                    }else{
                        throw new Error("Incorrect Password");
                    }
                
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (err: any) {
                    throw new Error("Error in authorize: " + err.message);
                }    
            },
        }),
   ],

   callbacks: {
        async jwt({ token, user }) {
            if(user){
                token._id= user._id?.toString()
                token.isVerified= user.isVerified
                token.isAcceptingMesages=user.isAcceptingMesages
                token.username= user.username
            }
            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id= token._id
                session.user.isVerified= token.isVerified
                session.user.isAcceptingMesages= token.isAcceptingMesages
                session.user.username= token.username
            }
            return session
        }
    },
    session:{
        strategy:"jwt"
    },
    pages:{
        signIn:"/sign-in"
    },
    secret:process.env.NEXTAUTH_SECRET,
    debug:true
}