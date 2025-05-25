import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      _id?:string,
      isVerified?: boolean,
      isAcceptingMesages?: boolean,
      username?:string
    } & DefaultSession["user"]
  }
  interface User {
    _id?:string,
    isVerified?: boolean,
    isAcceptingMesages?: boolean,
    username?:string
 }
}


declare module "next-auth/jwt" {
  interface JWT {
    _id?:string,
    isVerified?: boolean,
    isAcceptingMesages?: boolean,
    username?:string
  }
}