import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
export { default } from 'next-auth/middleware';

// If you only want to secure certain pages, export a config object with a matcher
export const config = {
    matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest){
    const token= await getToken({req : request})

    const url= request.nextUrl

    if(token && (
        url.pathname.startsWith("/sign-up")
        || url.pathname.startsWith("/sign-in")
        || url.pathname.startsWith("/verify")
    )){
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if(!token && url.pathname.startsWith("/dashboard")){
        return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    return NextResponse.next()

}