import mongoose from "mongoose";

interface connectionObject{
    isConnected?: number;
}

const connection : connectionObject= {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "");
        connection.isConnected= db.connections[0].readyState
        console.log('Database connected successfully');
    } catch (error) {
        console.log("DB connection Failed:",error)
        process.exit(1)
    }
} 

export default dbConnect;