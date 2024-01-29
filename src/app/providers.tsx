'use client';

import { AuthSession } from '@supabase/supabase-js';
import { useState } from 'react';
import { SupabaseUserProfile, UserContext } from './_providers/UserContext';

export function Providers({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<AuthSession | null>(null);
    const [userProfile, setUserProfile] = useState<SupabaseUserProfile | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <UserContext.Provider
            value={{
                session,
                userProfile,
                isLoading,
                isReady,
                hasError,
                error,
                setSession,
                setUserProfile,
                setIsLoading,
                setIsReady,
                setHasError,
                setError,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
