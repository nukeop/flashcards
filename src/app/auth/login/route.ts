import { createSSRClient } from '@/app/_lib/supabase';
import { AuthApiError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const requestUrl = new URL(request.url);
    const formData = await request.formData();
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const supabase = createSSRClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error instanceof AuthApiError) {
        return NextResponse.redirect(requestUrl.origin, {
            status: 301,
        });
    }

    return NextResponse.redirect(requestUrl.origin, {
        status: 301,
    });
}
