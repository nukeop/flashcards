import { createSSRClient } from '@/app/_lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const requestUrl = new URL(request.url);
    const formData = await request.formData();
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const supabase = createSSRClient();

    await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return NextResponse.redirect(requestUrl.origin, {
        status: 301,
    });
}
