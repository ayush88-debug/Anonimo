import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request) {
    
    dbConnect()

    try {
        const {username, content} = await request.json()

        const user= await UserModel.findOne({username}).exec()

        if(!user){
            return Response.json({
                success:false,
                message:"User Not found"
            },{status:404})
        }

        if(!user.isAcceptingMesages){
            return Response.json({
                success:false,
                message:"User is not accepting messages"
            },{status:403})
        }

        const newMessage= {content, createdAt:new Date()}

        user.messages.push(newMessage as Message)

        await user.save();

        return Response.json(
            {
                success:true,
                message:"Message sent successfully"
            }, {status:201}
        )
        
    } catch{
        return Response.json(
            {
                success:false,
                message: "Error in sending Message"
            },{status: 500}
        )
    }
}