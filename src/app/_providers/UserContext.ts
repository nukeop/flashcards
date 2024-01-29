import { AuthSession } from '@supabase/supabase-js';
import { createContext } from 'react';
import { Database } from '../_lib/database.types';

export type SupabaseUserProfile =
    Database['public']['Tables']['user_profiles']['Row'];

interface UserContextType {
    session: AuthSession | null;
    userProfile: SupabaseUserProfile | null;
    isLoading: boolean;
    isReady: boolean;
    hasError?: boolean;
    error?: string | null;
    setSession: (session: AuthSession | null) => void;
    setUserProfile: (userProfile: SupabaseUserProfile | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsReady: (isReady: boolean) => void;
    setHasError: (hasError: boolean) => void;
    setError: (error: string | null) => void;
}

const initialContext: UserContextType = {
    session: null,
    userProfile: null,
    isLoading: false,
    isReady: false,
    hasError: false,
    setSession: () => {},
    setUserProfile: () => {},
    setIsLoading: () => {},
    setIsReady: () => {},
    setHasError: () => {},
    setError: () => {},
};

export const UserContext = createContext<UserContextType>(initialContext);
