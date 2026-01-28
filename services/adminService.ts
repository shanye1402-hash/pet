import { supabase, DbUser, DbPet, DbApplication } from '../lib/supabaseClient';
import { supabaseRest } from '../lib/supabaseRestClient';

export interface AdminUser extends DbUser {
    // 扩展管理员用户类型，可用于添加额外字段
}

// ==================== 用户管理 ====================

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

// ==================== 宠物管理 ====================

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
    // 使用 supabaseRest 来确保认证 header 正确传递
    const result = await new Promise<{ data: any, error: any }>((resolve) => {
        supabaseRest.from('pets').insert(pet).then(resolve);
    });

    if (result.error) {
        console.error('Error creating pet:', result.error);
        throw result.error;
    }

    const createdPet = Array.isArray(result.data) ? result.data[0] : result.data;
    return createdPet;
}

export async function updatePet(id: string, updates: Partial<DbPet>): Promise<DbPet> {
    // 使用 supabaseRest 确保认证 header 正确传递
    const result = await new Promise<{ data: any, error: any }>((resolve) => {
        supabaseRest.from('pets').update(updates).eq('id', id).then(resolve);
    });

    if (result.error) {
        console.error('Error updating pet:', result.error);
        throw result.error;
    }

    // 检查是否有行被更新
    const updatedPet = Array.isArray(result.data) ? result.data[0] : result.data;
    if (!updatedPet) {
        throw new Error('更新失败：可能是权限不足或宠物不存在。请检查 Supabase RLS 策略。');
    }

    return updatedPet;
}

// ==================== 领养申请管理 ====================

export async function getAllApplications(): Promise<DbApplication[]> {
    // 使用 supabaseRest 确保认证正确
    const result = await new Promise<{ data: any, error: any }>((resolve) => {
        supabaseRest.from('applications').select('*').order('created_at', { ascending: false }).then(resolve);
    });

    if (result.error) {
        console.error('Error fetching applications:', result.error);
        throw result.error;
    }

    const applications = result.data || [];

    // 手动获取关联的 pet 和 user 数据
    const enrichedApplications = await Promise.all(applications.map(async (app: any) => {
        let pet = null;
        let user = null;

        // 获取宠物信息
        if (app.pet_id) {
            const petResult = await new Promise<{ data: any, error: any }>((resolve) => {
                supabaseRest.from('pets').select('*').eq('id', app.pet_id).single().then(resolve);
            });
            pet = petResult.data;
        }

        // 获取用户信息
        if (app.user_id) {
            const userResult = await new Promise<{ data: any, error: any }>((resolve) => {
                supabaseRest.from('users').select('*').eq('id', app.user_id).single().then(resolve);
            });
            user = userResult.data;
        }

        return {
            ...app,
            pet: pet ? { name: pet.name, image: pet.image } : null,
            user: user ? { name: user.name, email: user.email } : null,
        };
    }));

    return enrichedApplications;
}

export async function updateApplicationStatus(
    id: string,
    status: 'approved' | 'rejected',
    applicationInfo?: { userId: string, petId: string, petName: string, petImage: string }
): Promise<void> {
    // 使用 supabaseRest 更新状态
    const result = await new Promise<{ data: any, error: any }>((resolve) => {
        supabaseRest.from('applications').update({ status }).eq('id', id).then(resolve);
    });

    if (result.error) {
        console.error('Error updating application status:', result.error);
        throw result.error;
    }

    // 创建审核结果通知
    if (applicationInfo) {
        const { createApplicationApprovedNotification, createApplicationRejectedNotification } = await import('./notificationService');

        if (status === 'approved') {
            await createApplicationApprovedNotification(
                applicationInfo.userId,
                applicationInfo.petId,
                applicationInfo.petName,
                applicationInfo.petImage
            );
        } else if (status === 'rejected') {
            await createApplicationRejectedNotification(
                applicationInfo.userId,
                applicationInfo.petId,
                applicationInfo.petName,
                applicationInfo.petImage
            );
        }
    }
}
