import { supabase, DbUser } from '../lib/supabaseClient';
import { supabaseRest } from '../lib/supabaseRestClient';
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

    try {
        // 获取待审核申请数
        const { data: pendingApps } = await supabaseRest.from('applications')
            .select('*')
            .eq('user_id', user.id);

        const applicationsCount = (pendingApps || []).filter((app: any) => app.status === 'pending').length;
        const adoptedCount = (pendingApps || []).filter((app: any) => app.status === 'approved').length;

        // 获取收藏数
        const { data: favorites } = await supabaseRest.from('favorites')
            .select('*')
            .eq('user_id', user.id);

        const favoritesCount = (favorites || []).length;

        return {
            applications: applicationsCount,
            favorites: favoritesCount,
            adopted: adoptedCount,
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return { applications: 0, favorites: 0, adopted: 0 };
    }
}
