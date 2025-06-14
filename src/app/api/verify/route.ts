import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";



export async function POST(request: Request){
    dbConnect()

    try {
        const {username, code}= await request.json()

        const decodedUsername= decodeURIComponent(username);
        const user= await UserModel.findOne({
            username:decodedUsername
        })

        if(!user){
            return Response.json({
                success:false,
                message:"User Not found, Please register yourself first"
            },{status:404})
        }
        if(user.isVerified){
            return Response.json({
                success:false,
                message:"User already verified, Please Sign In."
            },{status:404})
        }

        const isvalid= code === user.verifycode;
        const isCodeNotExpired = new Date(user.verifycodeExpiry) > new Date()

        if(isvalid && isCodeNotExpired){
            user.isVerified=true;
            await user.save()

            return Response.json({
                success:true,
                message:"User successfully Verified"
            },{status:200})
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Code is Expired. Please try again"
            },{status:400})
        }
        else{
            return Response.json({
                success:false,
                message:"Code is Invalid"
            },{status:400})
        }

        
    } catch (err) {

        return Response.json({
            success:false,
            message:err.message || "Error while verifying code"
        },{status:500})
    }
}
