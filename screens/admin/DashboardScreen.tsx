import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface DashboardStats {
    totalUsers: number;
    pendingApplications: number;
    totalPets: number;
    approvedApplications: number;
    rejectedApplications: number;
}

const DashboardScreen: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        pendingApplications: 0,
        totalPets: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // 获取用户总数
            const { count: userCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            // 获取宠物总数
            const { count: petCount } = await supabase
                .from('pets')
                .select('*', { count: 'exact', head: true });

            // 获取待审核申请数
            const { count: pendingCount } = await supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            // 获取已通过申请数
            const { count: approvedCount } = await supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'approved');

            // 获取已拒绝申请数
            const { count: rejectedCount } = await supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'rejected');

            setStats({
                totalUsers: userCount || 0,
                totalPets: petCount || 0,
                pendingApplications: pendingCount || 0,
                approvedApplications: approvedCount || 0,
                rejectedApplications: rejectedCount || 0,
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: '总用户',
            value: stats.totalUsers,
            icon: 'group',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            title: '在管宠物',
            value: stats.totalPets,
            icon: 'pets',
            color: 'text-primary',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        },
        {
            title: '待审核申请',
            value: stats.pendingApplications,
            icon: 'pending_actions',
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        },
        {
            title: '已通过申请',
            value: stats.approvedApplications,
            icon: 'check_circle',
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            title: '已拒绝申请',
            value: stats.rejectedApplications,
            icon: 'cancel',
            color: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-text-main dark:text-text-main-dark mb-6">
                仪表盘
            </h1>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {statCards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                                <span className={`material-symbols-outlined ${card.color}`}>
                                    {card.icon}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-text-secondary">
                                    {card.title}
                                </h3>
                                <p className={`text-2xl font-bold ${card.color} mt-1`}>
                                    {card.value.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 快捷操作 */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                <h2 className="text-lg font-semibold text-text-main dark:text-text-main-dark mb-4">
                    快捷操作
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="#/admin/pets/new"
                        className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors group"
                    >
                        <span className="material-symbols-outlined text-primary">add_circle</span>
                        <span className="font-medium text-primary">添加新宠物</span>
                    </a>
                    <a
                        href="#/admin/applications"
                        className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-xl hover:bg-yellow-500/20 transition-colors group"
                    >
                        <span className="material-symbols-outlined text-yellow-600">rate_review</span>
                        <span className="font-medium text-yellow-600">审核申请</span>
                    </a>
                    <a
                        href="#/admin/users"
                        className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 transition-colors group"
                    >
                        <span className="material-symbols-outlined text-blue-500">manage_accounts</span>
                        <span className="font-medium text-blue-500">管理用户</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
