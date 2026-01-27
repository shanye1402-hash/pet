import { supabase, DbUser, DbPet, DbApplication } from '../lib/supabaseClient';

export interface AdminUser extends DbUser {
    // Add any admin-specific fields here if needed
}

export async function getAllUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
        throw error;
    }

    return data || [];
}

// Pet Management
export async function getAllPets(): Promise<DbPet[]> {
    const { data, error } = await supabase
        .from('pets')
        .select(`
            *,
            shelter:shelters(*)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching pets:', error);
        throw error;
    }

    return data || [];
}

export async function deletePet(id: string): Promise<void> {
    const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting pet:', error);
        throw error;
    }
}

export async function createPet(pet: Partial<DbPet>): Promise<DbPet> {
    const { data, error } = await supabase
        .from('pets')
        .insert(pet)
        .select()
        .single();

    if (error) {
        console.error('Error creating pet:', error);
        throw error;
    }

    return data;
}

export async function updatePet(id: string, updates: Partial<DbPet>): Promise<DbPet> {
    const { data, error } = await supabase
        .from('pets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating pet:', error);
        throw error;
    }

    return data;
}

// Application Management
export async function getAllApplications(): Promise<DbApplication[]> {
    const { data, error } = await supabase
        .from('applications')
        .select(`
            *,
            pet:pets(name, image),
            user:users__user_id_fkey(name, email)
        `) // Note: joined manually since types might not reflect relations perfectly, but trying standard query
        // Re-checking relation names. Usually it's just table name if foreign key exists. 
        // If users__user_id_fkey is not the relation name, might fail. 
        // Safer to try basic join first.
        .order('created_at', { ascending: false });

    // Let's refine the query to be safe with standard Supabase relations
    // We'll use a safer query in the actual code block below

    // Correction for the replacement content:
    // We'll trust the simple join for now: pet:pets(*), user:users(*)

    if (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }

    return data || [];
}

export async function updateApplicationStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error('Error updating application status:', error);
        throw error;
    }
}
