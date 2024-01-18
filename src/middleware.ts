import { NextRequest, NextResponse } from 'next/server';

import { createSSRClient } from './app/_lib/supabase';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createSSRClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    console.log(req.nextUrl.pathname);

    // if user is signed in and the current path is / redirect the user to /account
    if (
        (user && req.nextUrl.pathname === '/') ||
        req.nextUrl.pathname === '/login'
    ) {
        return NextResponse.redirect(new URL('/decks', req.url));
    }

    if (user && req.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/decks', req.url));
    }

    // if user is not signed in and the current path is not /login, redirect the user to /login
    if (!user && req.nextUrl.pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
}

export const config = {
    matcher: ['/decks', '/me', '/'],
};
