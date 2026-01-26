import { supabaseAuth, supabaseRest } from '../lib/supabaseRestClient';
import { DbUser } from '../lib/supabaseClient';

export interface SignUpData {
    email: string;
    password: string;
    name: string;
}

export interface SignInData {
    email: string;
    password: string;
}

// Sign up a new user
export async function signUp({ email, password, name }: SignUpData) {
    console.log('authService: signUp called');

    const result = await supabaseAuth.signUp(email, password);
    console.log('authService: signUp result:', result);

    if (result.error) throw new Error(result.error);

    const authData = result.data;
    // The signup response may have user data directly or nested
    const userId = authData?.user?.id || authData?.id;

    if (!userId) {
        console.log('authService: signUp response:', authData);
        throw new Error('注册失败：无法获取用户ID');
    }

    // Create user profile in our users table
    console.log('authService: Creating user profile for', userId);
    const { error: profileError } = await supabaseRest.from('users').insert({
        id: userId,
        email,
        name,
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
        location: '北京市',
    });

    if (profileError) {
        console.error('authService: Profile creation error:', profileError);
        throw profileError;
    }

    return authData;
}

// Sign in an existing user
export async function signIn({ email, password }: SignInData) {
    const { data, error } = await supabaseAuth.signInWithPassword(email, password);
    if (error) throw error;
    return data;
}

// Sign out
export async function signOut() {
    const { error } = await supabaseAuth.signOut();
    if (error) throw error;
}

// Get current user
export async function getCurrentUser() {
    const { data: { user } } = await supabaseAuth.getUser();
    return user;
}

// Get current session
export async function getSession() {
    const { data: { session } } = await supabaseAuth.getSession();
    return session;
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: any) => void) {
    return supabaseAuth.onAuthStateChange((event, session) => {
        callback(session?.user ?? null);
    });
}

// Get user profile from our users table
// If user doesn't exist in users table, create one automatically
export async function getUserProfile(): Promise<DbUser | null> {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabaseRest.from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !data) {
        console.log('User profile not found, creating one...');
        // User doesn't exist in users table, create one
        const newProfile = {
            id: user.id,
            email: user.email || '',
            name: user.email?.split('@')[0] || '新用户',
            avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
            location: '北京市',
        };

        const { data: created, error: createError } = await supabaseRest.from('users').insert(newProfile);

        if (createError) {
            console.error('Error creating user profile:', createError);
            return null;
        }

        // Return the newly created profile
        return newProfile as DbUser;
    }

    return data;
}
