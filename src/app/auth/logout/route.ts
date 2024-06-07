import { NextResponse } from 'next/server';
import { createSSRClient } from '@/app/_lib/supabase';

export async function POST(request: Request) {
    const requestUrl = new URL(request.url);
    const supabase = createSSRClient();

    await supabase.auth.signOut();

    return NextResponse.redirect(`${requestUrl.origin}`, {
        status: 301,
    });
}
