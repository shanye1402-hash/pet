import React, { useEffect, useState } from 'react';
import { getAllApplications, updateApplicationStatus } from '../../services/adminService';
import { DbApplication, DbPet } from '../../lib/supabaseClient';

// Extended type for joined data
interface ExtendedApplication extends Omit<DbApplication, 'pet' | 'user'> {
    pet?: Partial<DbPet> & { name: string; image: string };
    user?: { name: string; email: string };
}

const ApplicationListScreen: React.FC = () => {
    const [applications, setApplications] = useState<ExtendedApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await getAllApplications();
            // Need to verify if joined data comes through 'pet' and 'user' or other names
            // Supabase client usually maps them to the relation name if defined, or table name.
            setApplications(data as any);
        } catch (err: any) {
            setError(err.message || '获取申请列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        if (!window.confirm(`确定要${status === 'approved' ? '通过' : '拒绝'}这条申请吗？`)) return;

        try {
            await updateApplicationStatus(id, status);
            // Optimistic update
            setApplications(apps => apps.map(app =>
                app.id === id ? { ...app, status } : app
            ));
        } catch (err: any) {
            alert('操作失败: ' + err.message);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        };

        const labels: Record<string, string> = {
            pending: '待审核',
            approved: '已通过',
            rejected: '已拒绝',
            cancelled: '已取消',
        };

        return (
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[status] || styles.cancelled}`}>
                {labels[status] || status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {error}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-text-main dark:text-text-main-dark">领养申请</h1>
                <div className="bg-surface-light dark:bg-surface-dark px-4 py-2 rounded-xl border border-border-light dark:border-border-dark text-text-secondary text-sm">
                    共 {applications.length} 条申请
                </div>
            </div>

            <div className="grid gap-6">
                {applications.map((app) => (
                    <div key={app.id} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Pet Info */}
                            <div className="flex items-start gap-4 md:w-1/4">
                                <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                                    {app.pet?.image ? (
                                        <img src={app.pet.image} alt={app.pet.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-gray-400">pets</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main dark:text-text-main-dark">{app.pet?.name || '未知宠物'}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        {getStatusBadge(app.status)}
                                    </div>
                                </div>
                            </div>

                            {/* Applicant Info */}
                            <div className="md:w-1/4">
                                <h4 className="text-sm font-semibold text-text-secondary mb-2">申请人</h4>
                                <div className="text-text-main dark:text-text-main-dark font-medium">{app.form_data.name}</div>
                                <div className="text-sm text-text-secondary">{app.form_data.phone}</div>
                                <div className="text-sm text-text-secondary">{app.form_data.address}</div>
                            </div>

                            {/* Details */}
                            <div className="md:w-1/4 text-sm text-text-secondary space-y-1">
                                <p><span className="font-medium">住房:</span> {app.form_data.housingType}</p>
                                <p><span className="font-medium">已有宠物:</span> {app.form_data.hasPets ? '是' : '否'}</p>
                                <p><span className="font-medium">职业:</span> {app.form_data.job}</p>
                                <p><span className="font-medium">每日陪伴:</span> {app.form_data.timeCommitment}小时</p>
                            </div>

                            {/* Actions */}
                            <div className="md:w-1/4 flex flex-col items-end gap-3 justify-center">
                                {app.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'approved')}
                                            className="w-full bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            通过申请
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                            className="w-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors"
                                        >
                                            拒绝申请
                                        </button>
                                    </>
                                )}
                                {(app.status === 'approved' || app.status === 'rejected') && (
                                    <div className="text-sm text-text-secondary text-right">
                                        已于 {new Date().toLocaleDateString()} 完成审核
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                            <h4 className="text-sm font-semibold text-text-secondary mb-1">申请理由</h4>
                            <p className="text-text-main dark:text-text-main-dark text-sm">{app.form_data.reason}</p>
                        </div>
                    </div>
                ))}

                {applications.length === 0 && (
                    <div className="text-center py-12 text-text-secondary">暂无领养申请</div>
                )}
            </div>
        </div>
    );
};

export default ApplicationListScreen;
