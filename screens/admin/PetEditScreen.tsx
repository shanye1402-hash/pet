import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPet, updatePet } from '../../services/adminService';
import { getPetById } from '../../services/petService';
import { DbPet } from '../../lib/supabaseClient';

const PetEditScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<Partial<DbPet>>({
        name: '',
        breed: '',
        age: '0',
        age_unit: '岁',
        gender: 'Male',
        distance: '',
        price: '',
        location: '',
        weight: '',
        description: '',
        category: 'dogs',
        tags: [],
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop', // Placeholder default
    });

    useEffect(() => {
        if (isEditMode && id) {
            fetchPet(id);
        }
    }, [isEditMode, id]);

    const fetchPet = async (petId: string) => {
        try {
            const pet = await getPetById(petId);
            if (pet) {
                setFormData(pet);
            } else {
                setError('未找到宠物信息');
            }
        } catch (err: any) {
            setError(err.message || '获取信息失败');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode && id) {
                await updatePet(id, formData);
            } else {
                await createPet(formData);
            }
            navigate('/admin/pets');
        } catch (err: any) {
            setError(err.message || '保存失败');
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/pets')}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold text-text-main dark:text-text-main-dark">
                    {isEditMode ? '编辑宠物' : '添加新宠物'}
                </h1>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-lg font-semibold text-text-main dark:text-text-main-dark mb-4 border-b border-border-light dark:border-border-dark pb-2">
                            基本信息
                        </h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">图片链接</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                            placeholder="https://..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">宠物昵称</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                            placeholder="例如：旺财"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">品种</label>
                        <input
                            type="text"
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                            placeholder="例如：金毛"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">分类</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                        >
                            <option value="dogs">狗狗</option>
                            <option value="cats">猫咪</option>
                            <option value="birds">鸟类</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">年龄</label>
                            <input
                                type="text"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                                placeholder="2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">单位</label>
                            <select
                                name="age_unit"
                                value={formData.age_unit}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                            >
                                <option value="岁">岁</option>
                                <option value="个月">个月</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">性别</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                        >
                            <option value="Male">公</option>
                            <option value="Female">母</option>
                        </select>
                    </div>

                    {/* Details */}
                    <div className="col-span-1 md:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-text-main dark:text-text-main-dark mb-4 border-b border-border-light dark:border-border-dark pb-2">
                            详细信息
                        </h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">价格</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                            placeholder="$100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">体重</label>
                        <input
                            type="text"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                            placeholder="10kg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">位置</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                            placeholder="城市, 区域"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">距离</label>
                        <input
                            type="text"
                            name="distance"
                            value={formData.distance}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white"
                            placeholder="2.5km"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-text-secondary mb-2">描述</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:text-white resize-none"
                            placeholder="介绍一下这只宠物的性格、喜好等..."
                            required
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/pets')}
                        className="px-6 py-3 rounded-xl border border-border-light dark:border-border-dark font-medium text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        {loading && <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {isEditMode ? '保存修改' : '创建宠物'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PetEditScreen;
