import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
    dbConnect()

    try {
        const session = await getServerSession(nextAuthOptions)
        const user:User = session?.user as User

        if(!session || !session.user){
            return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },{status: 401})
        }

        const userID = new mongoose.Types.ObjectId(user._id)

        const userMessages = await UserModel.aggregate([
            { $match: { _id: userID } },
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt': -1}},
            {$group:{_id:'$_id', messages:{$push:'$messages'}}}
        ]).exec()

        if(!userMessages || userMessages?.length===0){
            return Response.json(
            {
                success:false,
                message:"No messages to display"
            },{status: 404})
        }

        return Response.json(
            {
                success:true,
                message:"successfully got messages",
                messages:userMessages[0].messages
            },{status:200}
        )
        
    } catch {
        return Response.json(
            {
                success:false,
                message: "Error in getting Messages"
            },{status: 500}
        )
    }
}