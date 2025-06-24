import { VerificationEmail } from "../../email/verificationEmail";
import { apiResponse } from "@/types/apiResponse";
import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    secure:true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'ayush.ghavghave.dev@gmail.com',
        pass: 'imnedaevrtjeucje'
    }
});

export async function sendVerificationMail(
    email:string,
    username:string,
    verifycode:string
):Promise<apiResponse>{

    try {

        const htmlBody = VerificationEmail(username, verifycode);

        const info = await transporter.sendMail({
            from: '"Ayush" <onboarding@anonimo.dev>',
            to: email,
            subject: "Anonimo App Verification Code",
            text: "Hello world?", // plain‑text body
            html:  htmlBody, // HTML body
        });
        console.log("Message sent:", info.messageId);
        return {
            success: true, 
            message:"Verification Email sent successfully"
        }
    } catch{
        return {
            success:false,
            message: "Failed to send verification email."
        }
    }
}