import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../services/authService';

const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                if (!email.trim() || !password.trim()) {
                    setError('请输入邮箱和密码');
                    setLoading(false);
                    return;
                }
                await signIn({ email, password });
            } else {
                if (!email.trim() || !password.trim() || !name.trim()) {
                    setError('请填写所有字段');
                    setLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setError('密码至少需要6位');
                    setLoading(false);
                    return;
                }
                await signUp({ email, password, name });
            }
            navigate('/');
        } catch (err: any) {
            console.error('Auth error:', err);
            if (err.message?.includes('Invalid login credentials')) {
                setError('邮箱或密码错误');
            } else if (err.message?.includes('User already registered')) {
                setError('该邮箱已注册，请直接登录');
            } else if (err.message?.includes('Email not confirmed')) {
                setError('请先验证邮箱后再登录');
            } else {
                setError(err.message || '操作失败，请重试');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 relative overflow-hidden font-display">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 size-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 size-80 bg-orange-500/10 rounded-full blur-3xl"></div>

            <div className="w-full max-w-sm relative z-10 flex flex-col gap-8">
                <div className="text-center flex flex-col items-center">
                    <div className="size-20 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-orange-500/30 mb-6 rotate-3">
                        <span className="material-symbols-outlined text-[48px]">pets</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#181411] dark:text-white mb-2">PawsAdopt</h1>
                    <p className="text-[#897561] dark:text-[#9e8c7a]">
                        {isLogin ? '欢迎回到您的宠物之家' : '创建您的账户'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {!isLogin && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-[#181411] dark:text-white ml-1">昵称</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#897561] text-[20px]">person</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="请输入您的昵称"
                                    className="w-full h-14 rounded-xl bg-white dark:bg-[#32281e] border border-transparent focus:border-primary focus:ring-0 pl-12 pr-4 text-[#181411] dark:text-white placeholder:text-[#897561]/50 shadow-sm transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#181411] dark:text-white ml-1">邮箱</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#897561] text-[20px]">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="请输入您的邮箱"
                                className="w-full h-14 rounded-xl bg-white dark:bg-[#32281e] border border-transparent focus:border-primary focus:ring-0 pl-12 pr-4 text-[#181411] dark:text-white placeholder:text-[#897561]/50 shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#181411] dark:text-white ml-1">密码</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#897561] text-[20px]">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isLogin ? "请输入密码" : "请设置密码（至少6位）"}
                                className="w-full h-14 rounded-xl bg-white dark:bg-[#32281e] border border-transparent focus:border-primary focus:ring-0 pl-12 pr-4 text-[#181411] dark:text-white placeholder:text-[#897561]/50 shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full h-14 bg-primary hover:bg-orange-600 active:scale-[0.98] rounded-xl text-white font-bold text-lg shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                            <>
                                {isLogin ? '登录' : '注册'}
                                <span className="material-symbols-outlined">{isLogin ? 'login' : 'person_add'}</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-primary font-medium hover:underline"
                    >
                        {isLogin ? '没有账户？立即注册' : '已有账户？立即登录'}
                    </button>
                </div>

                <p className="text-center text-xs text-[#897561] mt-2">
                    使用邮箱注册后即可开始使用所有功能
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;