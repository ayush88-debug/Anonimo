import { Message } from "@/model/User";

export interface apiResponse{
    success:boolean,
    message:string,
    isAcceptingMessages?:boolean,
    messages?:Message[]
    fullText?:string
} 