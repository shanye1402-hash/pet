import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPets, deletePet } from '../../services/adminService';
import { DbPet } from '../../lib/supabaseClient';

const PetListScreen: React.FC = () => {
    const [pets, setPets] = useState<DbPet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            setLoading(true);
            const data = await getAllPets();
            setPets(data);
        } catch (err: any) {
            setError(err.message || '获取宠物列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('确定要删除这只宠物吗？此操作不可恢复。')) return;

        try {
            await deletePet(id);
            setPets(pets.filter(pet => pet.id !== id));
        } catch (err: any) {
            alert('删除失败: ' + err.message);
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
                <h1 className="text-2xl font-bold text-text-main dark:text-text-main-dark">宠物管理</h1>
                <div className="flex gap-4">
                    <div className="bg-surface-light dark:bg-surface-dark px-4 py-2 rounded-xl border border-border-light dark:border-border-dark text-text-secondary text-sm flex items-center h-10">
                        共 {pets.length} 只宠物
                    </div>
                    <button
                        onClick={() => navigate('/admin/pets/new')}
                        className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 h-10 shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        添加宠物
                    </button>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">宠物信息</th>
                                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">品种</th>
                                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">年龄/性别</th>
                                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">救助站</th>
                                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">价格</th>
                                <th className="px-6 py-4 text-sm font-semibold text-text-secondary">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {pets.map((pet) => (
                                <tr key={pet.id} className="hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                                                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-text-main dark:text-text-main-dark">{pet.name}</div>
                                                <div className="text-xs text-text-secondary">{pet.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">{pet.breed}</td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">
                                        {pet.age}{pet.age_unit} · {pet.gender === 'Male' ? '公' : '母'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">
                                        {pet.shelter?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-primary">
                                        {pet.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/pets/edit/${pet.id}`)}
                                                className="text-primary hover:text-primary/80 font-medium text-sm p-2 hover:bg-primary/10 rounded-lg transition-colors"
                                                title="编辑"
                                            >
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pet.id)}
                                                className="text-red-500 hover:text-red-600 font-medium text-sm p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="删除"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pets.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                                        暂无宠物数据
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

export default PetListScreen;
