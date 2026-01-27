import React from 'react';

const DashboardScreen: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-text-main dark:text-text-main-dark mb-4">仪表盘</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-medium text-text-secondary">总用户</h3>
                    <p className="text-3xl font-bold text-primary mt-2">1,234</p>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-medium text-text-secondary">待审核申请</h3>
                    <p className="text-3xl font-bold text-primary mt-2">56</p>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-medium text-text-secondary">在管宠物</h3>
                    <p className="text-3xl font-bold text-primary mt-2">89</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
