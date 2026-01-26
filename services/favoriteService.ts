import { supabaseRest } from '../lib/supabaseRestClient';
import { DbFavorite, DbPet } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';

// Get all favorites for current user
export async function getFavorites(): Promise<DbPet[]> {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabaseRest.from('favorites')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }

    // Fetch pets for each favorite
    const pets: DbPet[] = [];
    for (const fav of data || []) {
        const { data: pet } = await supabaseRest.from('pets')
            .select('*')
            .eq('id', fav.pet_id)
            .single();
        if (pet) {
            pets.push(pet);
        }
    }

    return pets;
}

// Get favorite IDs for current user
export async function getFavoriteIds(): Promise<string[]> {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabaseRest.from('favorites')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching favorite IDs:', error);
        return [];
    }

    return (data || []).map((f: any) => f.pet_id);
}

// Check if a pet is favorited by current user
export async function isFavorite(petId: string): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;

    const { data, error } = await supabaseRest.from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('pet_id', petId)
        .single();

    if (error) return false;
    return !!data;
}

// Add a pet to favorites
export async function addFavorite(petId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('请先登录');

    const { error } = await supabaseRest.from('favorites').insert({
        user_id: user.id,
        pet_id: petId,
    });

    if (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
}

// Remove a pet from favorites
export async function removeFavorite(petId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('请先登录');

    const { error } = await supabaseRest.from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('pet_id', petId);

    if (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
}

// Toggle favorite status
export async function toggleFavorite(petId: string): Promise<boolean> {
    const isFav = await isFavorite(petId);

    if (isFav) {
        await removeFavorite(petId);
        return false;
    } else {
        await addFavorite(petId);
        return true;
    }
}
