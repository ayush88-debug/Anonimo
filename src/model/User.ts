
import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    ceratedAt: Date;
}

const messageSchema : Schema<Message> = new Schema({
    content:{
        type:String,
        required:[true,"Content is required"],
    },
    ceratedAt:{
        type:Date,
        required:[true, "ceratedAt is required"],
        default: Date.now()
    }
})

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifycode: string,
    verifycodeExpiry: Date,
    isVerified:boolean,
    isAcceptingMesages: boolean,
    messages: Message[];
}

const userSchema : Schema<User> = new Schema({
    username:{
        type:String,
        required:[true, "Username is required"],
        trim: true,
        unique:true,
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password:{
        type:String,
        required:[true, "password is required"],
    },
    verifycode:{
        type:String,
        required:[true, "verifycode is required"],
    },
    verifycodeExpiry:{
        type:Date,
        required:[true, "verifycodeExpiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMesages:{
        type:Boolean,
        default:true,
    },
    messages: [messageSchema]
})


const UserModel= 
    (mongoose.models.User as mongoose.Model<User>) || 
        (mongoose.model<User>("User", userSchema))

export default UserModel;