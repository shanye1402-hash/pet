-- Seed data for PawsAdopt
-- Run this after schema.sql

-- Insert shelters
INSERT INTO shelters (id, name, logo, distance) VALUES
  ('a1111111-1111-1111-1111-111111111111', '快乐爪爪救助中心', 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png', '2.5 英里外'),
  ('a2222222-2222-2222-2222-222222222222', '爱心宠物之家', 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png', '1.2公里'),
  ('a3333333-3333-3333-3333-333333333333', '喵喵救助站', 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png', '3.8公里'),
  ('a4444444-4444-4444-4444-444444444444', '流浪猫狗救助', 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png', '3.8公里'),
  ('a5555555-5555-5555-5555-555555555555', '快乐汪汪', 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png', '2.5公里');

-- Insert pets
INSERT INTO pets (id, name, breed, age, age_unit, gender, distance, image, price, location, weight, description, category, tags, shelter_id) VALUES
  (
    'b1111111-1111-1111-1111-111111111111',
    '麻薯',
    '金毛寻回犬',
    '2',
    '岁',
    'Male',
    '2.5公里',
    'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=1000&auto=format&fit=crop',
    '$120',
    '加州圣莫尼卡',
    '12公斤',
    '麻薯是个开心果，喜欢在沙滩上散步和玩捡球游戏。他对小孩子特别温柔，是我们收容所的宠儿。他已经训练好定点排泄，并懂得"坐下"和"待着"等基本指令。麻薯正在寻找一个永远的家，那里有无数的肚皮按摩和拥抱等着他。',
    'dogs',
    ARRAY['已打疫苗', '亲人', '对小孩友好'],
    'a1111111-1111-1111-1111-111111111111'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    '查理',
    '金毛寻回犬',
    '2',
    '个月',
    'Male',
    '1.2公里',
    'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?q=80&w=600&auto=format&fit=crop',
    '$200',
    '上海市徐汇区',
    '3公斤',
    '查理是一只非常活泼的小金毛，非常喜欢和人互动。',
    'dogs',
    ARRAY['已打疫苗'],
    'a2222222-2222-2222-2222-222222222222'
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    '糯米',
    '暹罗猫',
    '1',
    '岁',
    'Female',
    '3.8公里',
    'https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=600&auto=format&fit=crop',
    '$80',
    '北京市朝阳区',
    '4公斤',
    '糯米性格温顺，喜欢晒太阳。',
    'cats',
    ARRAY['已绝育'],
    'a3333333-3333-3333-3333-333333333333'
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    '露娜',
    '虎斑猫',
    '1',
    '岁',
    'Female',
    '3.8公里',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop',
    '$60',
    '北京市朝阳区',
    '3.5公斤',
    '露娜很安静，适合喜欢安静环境的家庭。',
    'cats',
    ARRAY['亲人'],
    'a4444444-4444-4444-4444-444444444444'
  ),
  (
    'b5555555-5555-5555-5555-555555555555',
    '库珀',
    '比格犬',
    '3',
    '岁',
    'Male',
    '2.5公里',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=600&auto=format&fit=crop',
    '$100',
    '广州市天河区',
    '10公斤',
    '库珀精力充沛，需要大量的运动。',
    'dogs',
    ARRAY['活泼'],
    'a5555555-5555-5555-5555-555555555555'
  );
