import dbConnect from "@/lib/dbConnect";


export async function POST(request: Request){

    dbConnect();

    const {username, email, password}= await request.json();
}