import mongoose from "mongoose";

interface connectionObject{
    isConnected?: number;
}

const connection : connectionObject= {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "");
        connection.isConnected= db.connections[0].readyState
    } catch {
        process.exit(1)
    }
} 

export default dbConnect;