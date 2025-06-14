import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/verificationEmail";
import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationMail(
    email:string,
    username:string,
    verifycode:string
):Promise<apiResponse>{

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonimo App Verification Code',
            react: VerificationEmail({username, otp: verifycode}),
        });
        return {
            success: true, 
            message:"Verification Email sent successfully"
        }
    } catch (error) {
        return {
            success:false,
            message: "Failed to send verification email."
        }
    }
}