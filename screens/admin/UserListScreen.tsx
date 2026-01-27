import React, { useEffect, useState } from 'react';
import { getAllUsers, AdminUser } from '../../services/adminService';

const UserListScreen: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || '获取用户列表失败');
        } finally {
            setLoading(false);
        }
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
                <h1 className="text-2xl font-bold text-text-main dark:text-text-main-dark">用户管理</h1>
                <div className="bg-surface-light dark:bg-surface-dark px-4 py-2 rounded-xl border border-border-light dark:border-border-dark text-text-secondary text-sm">
                    共 {users.length} 位用户
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">用户</th>
                                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">邮箱</th>
                                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">位置</th>
                                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">注册时间</th>
                                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-primary text-xl">person</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-text-main dark:text-text-main-dark">{user.name || '未命名'}</div>
                                                <div className="text-xs text-text-secondary">{user.id.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">{user.location || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-primary hover:text-primary/80 font-medium text-sm">
                                            查看详情
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                                        暂无用户数据
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserListScreen;
