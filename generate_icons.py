#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成微信小程序所需的图标文件
"""

import os
from PIL import Image, ImageDraw, ImageFont
import base64
from io import BytesIO

def create_icon(size=(48, 48), color='#666666', active_color='#1890ff'):
    """创建基础图标"""
    # 创建透明背景图片
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    return img

def create_home_icon(size=(48, 48), color='#666666'):
    """创建首页图标"""
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 绘制房子形状
    w, h = size
    # 屋顶
    draw.polygon([(w//4, h//2), (w//2, h//4), (3*w//4, h//2)], fill=color)
    # 房身
    draw.rectangle([w//4, h//2, 3*w//4, 3*h//4], fill=color)
    # 门
    draw.rectangle([5*w//12, 7*h//12, 7*w//12, 3*h//4], fill='white')
    
    return img

def create_store_icon(size=(48, 48), color='#666666'):
    """创建门店图标"""
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    w, h = size
    # 绘制位置标记
    center_x, center_y = w//2, h//2
    # 外圆
    draw.ellipse([center_x-w//3, center_y-h//3, center_x+w//3, center_y+h//3], outline=color, width=3)
    # 内圆
    draw.ellipse([center_x-w//6, center_y-h//6, center_x+w//6, center_y+h//6], fill=color)
    
    return img

def create_order_icon(size=(48, 48), color='#666666'):
    """创建订单图标"""
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    w, h = size
    # 绘制文档形状
    draw.rectangle([w//4, h//6, 3*w//4, 5*h//6], outline=color, width=2)
    # 绘制文本线条
    for i in range(3):
        y = h//3 + i * h//8
        draw.line([w//3, y, 2*w//3, y], fill=color, width=2)
    
    return img

def create_profile_icon(size=(48, 48), color='#666666'):
    """创建个人中心图标"""
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    w, h = size
    center_x = w // 2
    # 头部
    draw.ellipse([center_x-w//6, h//4, center_x+w//6, h//4+h//3], outline=color, width=3)
    # 身体
    draw.arc([center_x-w//3, 2*h//3, center_x+w//3, h], start=0, end=180, fill=color, width=3)
    
    return img

def save_icons():
    """保存所有图标"""
    icons_dir = 'miniprogram/images'
    os.makedirs(icons_dir, exist_ok=True)
    
    # 普通状态图标
    icons = {
        'home.png': create_home_icon(),
        'store.png': create_store_icon(),
        'order.png': create_order_icon(),
        'profile.png': create_profile_icon(),
    }
    
    # 激活状态图标
    active_icons = {
        'home-active.png': create_home_icon(color='#1890ff'),
        'store-active.png': create_store_icon(color='#1890ff'),
        'order-active.png': create_order_icon(color='#1890ff'),
        'profile-active.png': create_profile_icon(color='#1890ff'),
    }
    
    # 保存普通图标
    for filename, img in icons.items():
        img.save(os.path.join(icons_dir, filename))
        print(f'已创建: {filename}')
    
    # 保存激活图标
    for filename, img in active_icons.items():
        img.save(os.path.join(icons_dir, filename))
        print(f'已创建: {filename}')
    
    # 创建其他需要的图标
    other_icons = [
        'default-avatar.png',
        'default-store.png',
        'room-default.jpg',
        'smart-lock.png',
        'password-icon.png',
        'bluetooth-icon.png',
        'qr-icon.png',
        'success-icon.png',
        'error-icon.png',
        'empty-order.png'
    ]
    
    for icon_name in other_icons:
        # 创建简单的占位图标
        img = Image.new('RGBA', (48, 48), (200, 200, 200, 255))
        draw = ImageDraw.Draw(img)
        draw.rectangle([4, 4, 44, 44], outline='#999999', width=2)
        img.save(os.path.join(icons_dir, icon_name))
        print(f'已创建占位图标: {icon_name}')

if __name__ == '__main__':
    try:
        save_icons()
        print('\n所有图标创建完成！')
    except ImportError:
        print('需要安装 Pillow 库: pip install Pillow')
    except Exception as e:
        print(f'创建图标时出错: {e}')