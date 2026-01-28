import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from '../../services/authService';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/admin/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/admin/dashboard', label: '仪表盘', icon: 'dashboard' },
        { path: '/admin/users', label: '用户管理', icon: 'group' },
        { path: '/admin/pets', label: '宠物管理', icon: 'pets' },
        { path: '/admin/applications', label: '领养申请', icon: 'description' },
    ];

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark">
            {/* Sidebar */}
            <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col">
                <div className="p-6 border-b border-border-light dark:border-border-dark">
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">pets</span>
                        PawsAdmin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-border-light dark:border-border-dark">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-medium">退出登录</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold text-text-main dark:text-text-main-dark">
                        管理后台
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-sm">person</span>
                        </div>
                        <span className="text-sm font-medium text-text-main dark:text-text-main-dark">Admin</span>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
