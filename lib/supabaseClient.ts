import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// Configure Supabase client with custom options to prevent AbortError
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    global: {
        headers: {
            'x-client-info': 'pawsadopt-web',
        },
    },
    // Disable realtime to prevent connection issues
    realtime: {
        params: {
            eventsPerSecond: 1,
        },
    },
});

// Database types
export interface DbUser {
    id: string;
    email: string;
    name: string;
    phone?: string;
    location?: string;
    avatar_url?: string;
    bio?: string;
    created_at: string;
}

export interface DbShelter {
    id: string;
    name: string;
    logo: string;
    distance: string;
    created_at: string;
}

export interface DbPet {
    id: string;
    name: string;
    breed: string;
    age: string;
    age_unit: string;
    gender: 'Male' | 'Female';
    distance: string;
    image: string;
    price: string;
    location: string;
    weight: string;
    description: string;
    category: 'dogs' | 'cats' | 'birds';
    tags: string[];
    shelter_id: string;
    created_at: string;
    // Joined fields
    shelter?: DbShelter;
}

export interface DbApplication {
    id: string;
    user_id: string;
    pet_id: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    form_data: {
        name: string;
        phone: string;
        address: string;
        job: string;
        housingType: string;
        hasPets: boolean;
        reason: string;
        experience: string;
        timeCommitment: number;
        activityLevel: string;
    };
    created_at: string;
    // Joined fields
    pet?: DbPet;
}

export interface DbFavorite {
    id: string;
    user_id: string;
    pet_id: string;
    created_at: string;
}

export interface DbConversation {
    id: string;
    user_id: string;
    shelter_id: string;
    created_at: string;
    // Joined fields
    shelter?: DbShelter;
    last_message?: DbMessage;
}

export interface DbMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    sender_type: 'user' | 'shelter';
    content: string;
    created_at: string;
}
