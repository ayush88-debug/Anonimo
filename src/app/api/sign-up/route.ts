import { sendVerificationMail } from "@/helpers/sendVerificationMail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcrypt'


export async function POST(request: Request){

    dbConnect();

    try {
        const {username, email, password}= await request.json();

        const verifiedUserBYUsername= await UserModel.findOne({
            username, 
            isVerified:true
        })

        if(verifiedUserBYUsername){
            return Response.json(
                {
                    success:false,
                    message:"Username already exist"
                },
                {
                    status:400
                }
            )
        }

        const userByEmail= await UserModel.findOne({email});

        const verifyCode= Math.floor(100000 + Math.random() * 900000).toString()

        if(userByEmail){
            if(userByEmail.isVerified){
                return Response.json(
                    {
                        success:false,
                        message:"Username with Email already exist"
                    },
                    {
                        status:400
                    }
                )
            }else{
                const hashedPassword= await bcrypt.hash(password, 10);
                const expiryTime= new Date();
                expiryTime.setHours(expiryTime.getHours() + 1)

                userByEmail.username=username
                userByEmail.password= hashedPassword
                userByEmail.verifycode=verifyCode
                userByEmail.verifycodeExpiry= expiryTime

                await userByEmail.save()
            }
        }else{
            const UserBYUsername= await UserModel.findOne({
                username,
            })

            if(UserBYUsername){
                return Response.json(
                    {
                        success:false,
                        message:"Username is already taken, Try another."
                    },
                    {
                        status:400
                    }
                )
            }

            const hashedPassword= await bcrypt.hash(password, 10);
            const expiryTime= new Date();
            expiryTime.setHours(expiryTime.getHours() + 1)

            const newUser= await UserModel.create({
                    username,
                    email,
                    password: hashedPassword,
                    verifycode: verifyCode,
                    verifycodeExpiry: expiryTime,
                    isVerified: false,
                    isAcceptingMesages: true,
                    messages: []
            })
            await newUser.save()
        }

        const emailResponse= await sendVerificationMail(
            email,
            username,
            verifyCode
        );

        if(!emailResponse.success){
            return Response.json(
                {
                    success:false,
                    message:emailResponse.message
                },
                {
                    status:500
                }
            )
        }

        return Response.json(
            {
                success:true,
                message:"User Registered successfully. Please Verify userself."
                
            },
            {
                status:201
            }
        )


        
    } catch (error) {
        console.log("Error while user sign up: ",error)
        return Response.json(
            {
                success:false,
                message:"Error while user sign up"
            },
            {
                status:500
            }
        )
        
    }

    
}