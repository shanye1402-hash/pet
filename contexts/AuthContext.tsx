import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseAuth } from '../lib/supabaseRestClient';
import { getSession, getUserProfile } from '../services/authService';
import { DbUser } from '../lib/supabaseClient';

interface AuthContextType {
    user: any | null;
    profile: DbUser | null;
    session: any | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [profile, setProfile] = useState<DbUser | null>(null);
    const [session, setSession] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        if (user) {
            const userProfile = await getUserProfile();
            setProfile(userProfile);
        }
    };

    useEffect(() => {
        let mounted = true;

        // Get initial session
        const initAuth = async () => {
            console.log('AuthContext: Starting auth initialization...');

            try {
                console.log('AuthContext: Calling getSession...');
                const initialSession = await getSession();
                console.log('AuthContext: getSession returned:', initialSession ? 'session exists' : 'no session');

                if (!mounted) return;

                setSession(initialSession);
                setUser(initialSession?.user ?? null);

                if (initialSession?.user) {
                    console.log('AuthContext: Fetching user profile...');
                    const userProfile = await getUserProfile();
                    if (!mounted) return;
                    setProfile(userProfile);
                    console.log('AuthContext: Profile loaded');
                }

                setLoading(false);
                console.log('AuthContext: Auth initialization complete');
            } catch (error: any) {
                console.error('AuthContext: Auth init error:', error);
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabaseAuth.onAuthStateChange(
            async (event, newSession) => {
                console.log('AuthContext: Auth state changed:', event);
                if (!mounted) return;

                setSession(newSession);
                setUser(newSession?.user ?? null);

                if (newSession?.user) {
                    try {
                        const userProfile = await getUserProfile();
                        if (mounted) {
                            setProfile(userProfile);
                        }
                    } catch (error) {
                        console.error('Error fetching profile:', error);
                    }
                } else {
                    setProfile(null);
                }

                setLoading(false);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, session, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
