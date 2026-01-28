import { supabaseRest } from '../lib/supabaseRestClient';
import { DbApplication } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';
import { createApplicationSubmittedNotification } from './notificationService';

export interface ApplicationFormData {
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
}

// Submit a new adoption application
export async function submitApplication(petId: string, formData: ApplicationFormData, petInfo?: { name: string, image: string }) {
    const user = await getCurrentUser();
    if (!user) throw new Error('请先登录');

    const { data, error } = await supabaseRest.from('applications').insert({
        user_id: user.id,
        pet_id: petId,
        status: 'pending',
        form_data: formData,
    });

    if (error) {
        console.error('Error submitting application:', error);
        throw error;
    }

    // 创建申请提交通知
    if (petInfo) {
        await createApplicationSubmittedNotification(user.id, petId, petInfo.name, petInfo.image);
    }

    return data;
}

// Get all applications for current user
export async function getMyApplications(): Promise<DbApplication[]> {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data: applications, error } = await supabaseRest.from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching applications:', error);
        return [];
    }

    // Fetch pet and shelter info for each application
    const result = await Promise.all((applications || []).map(async (app: any) => {
        const { data: pet } = await supabaseRest.from('pets')
            .select('*')
            .eq('id', app.pet_id)
            .single();

        let shelter = null;
        if (pet?.shelter_id) {
            const { data: shelterData } = await supabaseRest.from('shelters')
                .select('*')
                .eq('id', pet.shelter_id)
                .single();
            shelter = shelterData;
        }

        return {
            ...app,
            pet: pet ? { ...pet, shelter } : null,
        };
    }));

    return result;
}

// Cancel an application
export async function cancelApplication(applicationId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('请先登录');

    // Note: REST client doesn't support update, would need to implement
    console.log('cancelApplication not fully implemented with REST client');
}

// Get application count for current user
export async function getApplicationCount(): Promise<number> {
    const user = await getCurrentUser();
    if (!user) return 0;

    const { data, error } = await supabaseRest.from('applications')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error counting applications:', error);
        return 0;
    }

    // Count pending applications
    const pendingCount = (data || []).filter((app: any) => app.status === 'pending').length;
    return pendingCount;
}
