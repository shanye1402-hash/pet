import { supabaseRest } from '../lib/supabaseRestClient';
import { getCurrentUser } from './authService';

export interface Notification {
    id: string;
    user_id: string;
    type: 'application_submitted' | 'application_approved' | 'application_rejected' | 'system';
    title: string;
    message: string;
    pet_id?: string;
    pet_name?: string;
    pet_image?: string;
    is_read: boolean;
    created_at: string;
}

// 获取用户的所有通知
export async function getNotifications(): Promise<Notification[]> {
    const user = await getCurrentUser();
    if (!user) return [];

    const result = await new Promise<{ data: any, error: any }>((resolve) => {
        supabaseRest.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(resolve);
    });

    if (result.error) {
        console.error('Error fetching notifications:', result.error);
        return [];
    }

    return result.data || [];
}

// 创建通知
export async function createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<void> {
    const result = await new Promise<{ data: any, error: any }>((resolve) => {
        supabaseRest.from('notifications').insert({
            ...notification,
            is_read: false,
        }).then(resolve);
    });

    if (result.error) {
        console.error('Error creating notification:', result.error);
        // 不抛出错误，通知创建失败不应该影响主流程
    }
}

// 标记通知为已读
export async function markNotificationAsRead(notificationId: string): Promise<void> {
    const result = await new Promise<{ data: any, error: any }>((resolve) => {
        supabaseRest.from('notifications').update({ is_read: true }).eq('id', notificationId).then(resolve);
    });

    if (result.error) {
        console.error('Error marking notification as read:', result.error);
    }
}

// 标记所有通知为已读
export async function markAllNotificationsAsRead(): Promise<void> {
    const user = await getCurrentUser();
    if (!user) return;

    const result = await new Promise<{ data: any, error: any }>((resolve) => {
        supabaseRest.from('notifications').update({ is_read: true }).eq('user_id', user.id).then(resolve);
    });

    if (result.error) {
        console.error('Error marking all notifications as read:', result.error);
    }
}

// 获取未读通知数量
export async function getUnreadNotificationCount(): Promise<number> {
    const user = await getCurrentUser();
    if (!user) return 0;

    const result = await new Promise<{ data: any, error: any }>((resolve) => {
        supabaseRest.from('notifications').select('*').eq('user_id', user.id).eq('is_read', 'false').then(resolve);
    });

    if (result.error) {
        console.error('Error counting unread notifications:', result.error);
        return 0;
    }

    return (result.data || []).length;
}

// 创建申请提交通知
export async function createApplicationSubmittedNotification(userId: string, petId: string, petName: string, petImage: string): Promise<void> {
    await createNotification({
        user_id: userId,
        type: 'application_submitted',
        title: '申请已提交',
        message: `您已成功提交对「${petName}」的领养申请，请耐心等待审核。`,
        pet_id: petId,
        pet_name: petName,
        pet_image: petImage,
    });
}

// 创建申请通过通知
export async function createApplicationApprovedNotification(userId: string, petId: string, petName: string, petImage: string): Promise<void> {
    await createNotification({
        user_id: userId,
        type: 'application_approved',
        title: '申请已通过 🎉',
        message: `恭喜！您对「${petName}」的领养申请已通过审核，请联系救助中心安排接宠事宜。`,
        pet_id: petId,
        pet_name: petName,
        pet_image: petImage,
    });
}

// 创建申请拒绝通知
export async function createApplicationRejectedNotification(userId: string, petId: string, petName: string, petImage: string): Promise<void> {
    await createNotification({
        user_id: userId,
        type: 'application_rejected',
        title: '申请未通过',
        message: `很抱歉，您对「${petName}」的领养申请未通过审核。您可以尝试申请其他宠物。`,
        pet_id: petId,
        pet_name: petName,
        pet_image: petImage,
    });
}
