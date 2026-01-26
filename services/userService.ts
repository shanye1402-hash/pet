import { supabase, DbUser } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';

// Get current user's profile
export async function getProfile(): Promise<DbUser | null> {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
}

// Update user profile
export async function updateProfile(updates: Partial<DbUser>) {
    const user = await getCurrentUser();
    if (!user) throw new Error('请先登录');

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }

    return data;
}

// Upload avatar image
export async function uploadAvatar(file: File): Promise<string> {
    const user = await getCurrentUser();
    if (!user) throw new Error('请先登录');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    // Update user profile with new avatar URL
    await updateProfile({ avatar_url: publicUrl });

    return publicUrl;
}

// Get user stats
export async function getUserStats() {
    const user = await getCurrentUser();
    if (!user) return { applications: 0, favorites: 0, adopted: 0 };

    // Get pending applications count
    const { count: applicationsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending');

    // Get favorites count
    const { count: favoritesCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    // Get approved applications (adopted pets) count
    const { count: adoptedCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'approved');

    return {
        applications: applicationsCount || 0,
        favorites: favoritesCount || 0,
        adopted: adoptedCount || 0,
    };
}
