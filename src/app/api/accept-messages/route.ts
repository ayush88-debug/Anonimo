import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { nextAuthOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function POST(request:Request) {

    dbConnect();

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

        const userID= user._id
        const {acceptMessges}= await request.json()

        const UpdatedUser= await UserModel.findByIdAndUpdate(
            userID,
            {isAcceptingMesages:acceptMessges},
            {new:true}
        )

        if(!UpdatedUser){
            return Response.json(
                {
                    success:false,
                    message:"User not found to update status"
                },{status: 404}
            )
        }

        return Response.json(
            {
                success:false,
                message:"successfully Updated accept message status",
                UpdatedUser
            },{status: 200}
        )


        
    } catch (error) {
        console.log("Error in Updating accept messages status", error)
        return Response.json(
            {
                success:false,
                message:"Error in Updating accept messages status"
            },{status: 500}
        )
    }
    
}

export async function GET(request:Request) {
    dbConnect();

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

        const userID= user._id

        const foundUSer= await UserModel.findById(userID)

        if(!foundUSer){
            return Response.json(
                {
                    success:false,
                    message:"User not found to fetch accept status"
                },{status: 404}
            )
        }

        return Response.json(
            {
                success:false,
                message:"successfully fetched accept message status",
                isAcceptingMessages: foundUSer.isAcceptingMesages
            },{status: 200}
        )


    } catch (error) {
        console.log("Error in fetching accept messages status", error)
        return Response.json(
            {
                success:false,
                message:"Error in fetching accept messages status"
            },{status: 500}
        )
    }
}