import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { nextAuthOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function DELETE(request: Request){
    dbConnect()

    try {
        const session= await getServerSession(nextAuthOptions)
        const user:User= session?.user as User      
        
        if(!session || !session.user){
            return Response.json({
                success:false,
                message:"NOT Authenticated"
            },{status:401})
        }

        const {searchParams}= new URL(request.url);
        const messageIdStr= searchParams.get("messageID")

        if(!messageIdStr?.trim()){
            return Response.json({
                success:false,
                message: "Invalid messageID"
            }, {status:401})
        }

        const messageID= new mongoose.Types.ObjectId(messageIdStr)

        const response = await UserModel.updateOne(
            {_id:user._id},
            {$pull: {messages : {_id: messageID}}}
        )

        if(response.modifiedCount == 0){
            return Response.json({
                success:false,
                message: "Message Not Found"
            }, {status:404})
        }

        return Response.json({
            success:true,
            message: "Message Deleted"
        }, {status:200})

    } catch {
        return Response.json({
            success:false,
            message: "Error while deleting Message"
        }, {status: 500})
    }
}