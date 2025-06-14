import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";


export async function GET(request: Request){
    dbConnect()

    const usernameQueryvalidation = z.object({
        username: usernameValidation
    })

    try {
        const {searchParams}= new URL(request.url);
        const queryParam= {
            username: searchParams.get("username")
        }

        const result= usernameQueryvalidation.safeParse(queryParam)

        if(!result.success){
            const usernameError=result?.error?.format().username?._errors || []
            return Response.json({
                success:false,
                message: usernameError?.length>0 ? usernameError.join(", ") : "Invalid Username"
            }, {status:400})
        }

        const {username}= result.data

        const existingVarifiedUser= await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingVarifiedUser){
            return Response.json({
                success:false,
                message:"Username is already taken"
            }, {status:400})
        }

        return Response.json({
                success:true,
                message:"Username is unique"
        }, {status:200})
        
        
    } catch (error) {
        return Response.json({
            success:false,
            message: error.message || "Error in Check Unique username"
        }, {status:500})
    }
}