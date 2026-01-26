import { supabaseRest, supabaseAuth } from '../lib/supabaseRestClient';
import { DbPet } from '../lib/supabaseClient';

// Get all pets with optional filtering
export async function getPets(category?: string, search?: string): Promise<DbPet[]> {
    console.log('petService: getPets called with', { category, search });

    try {
        let query = supabaseRest.from('pets').select('*');

        if (category) {
            query = query.eq('category', category);
        }

        query = query.order('created_at', { ascending: false });

        console.log('petService: Executing query...');
        const { data, error } = await query;

        if (error) {
            console.error('petService: Error fetching pets:', error);
            return [];
        }

        console.log('petService: Got', data?.length || 0, 'pets');

        // Fetch shelters separately and join
        const petsWithShelters = await Promise.all((data || []).map(async (pet: any) => {
            if (pet.shelter_id) {
                const { data: shelter } = await supabaseRest.from('shelters')
                    .select('*')
                    .eq('id', pet.shelter_id)
                    .single();
                return { ...pet, shelter };
            }
            return pet;
        }));

        return petsWithShelters;
    } catch (error: any) {
        console.error('petService: Exception:', error.message);
        return [];
    }
}

// Get a single pet by ID
export async function getPetById(id: string): Promise<DbPet | null> {
    try {
        const { data: pet, error } = await supabaseRest.from('pets')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !pet) {
            console.error('Error fetching pet:', error);
            return null;
        }

        // Get shelter info
        if (pet.shelter_id) {
            const { data: shelter } = await supabaseRest.from('shelters')
                .select('*')
                .eq('id', pet.shelter_id)
                .single();
            return { ...pet, shelter };
        }

        return pet;
    } catch (error) {
        console.error('Error fetching pet:', error);
        return null;
    }
}

// Get categories (static for now, can be made dynamic later)
export function getCategories() {
    return [
        { id: 'dogs', name: '小狗', icon: 'pets' },
        { id: 'cats', name: '小猫', icon: 'cruelty_free' },
    ];
}

// Transform database pet to frontend Pet type
export function transformPet(dbPet: DbPet) {
    return {
        id: dbPet.id,
        name: dbPet.name,
        breed: dbPet.breed,
        age: dbPet.age,
        ageUnit: dbPet.age_unit,
        gender: dbPet.gender,
        distance: dbPet.distance,
        image: dbPet.image,
        price: dbPet.price,
        location: dbPet.location,
        weight: dbPet.weight,
        description: dbPet.description,
        category: dbPet.category,
        tags: dbPet.tags || [],
        shelterName: dbPet.shelter?.name || '',
        shelterDistance: dbPet.shelter?.distance || '',
        shelterLogo: dbPet.shelter?.logo || '',
    };
}
