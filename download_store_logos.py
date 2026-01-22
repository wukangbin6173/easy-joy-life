#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
下载多个门店logo，为不同门店提供不同的视觉效果
"""

import requests
import os
import time
from urllib.parse import urlparse

def download_image(url, filename, description=""):
    """下载图片"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, stream=True, timeout=30)
        response.raise_for_status()
        
        # 确保目录存在
        os.makedirs('miniprogram/images', exist_ok=True)
        
        filepath = f'miniprogram/images/{filename}'
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f'✓ 成功下载: {filename} - {description}')
        return True
        
    except Exception as e:
        print(f'✗ 下载失败 {filename}: {e}')
        return False

def main():
    """主函数"""
    
    # 门店logo列表 - 使用不同风格的棋牌室相关图片
    store_logos = [
        {
            'url': 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'filename': 'store-logo-1.jpg',
            'description': '现代简约风格棋牌室'
        },
        {
            'url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'filename': 'store-logo-2.jpg',
            'description': '传统中式棋牌室'
        },
        {
            'url': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'filename': 'store-logo-3.jpg',
            'description': '商务高端棋牌室'
        },
        {
            'url': 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'filename': 'store-logo-4.jpg',
            'description': '时尚潮流棋牌室'
        },
        {
            'url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'filename': 'store-logo-5.jpg',
            'description': '温馨舒适棋牌室'
        },
        # 使用免费的图标作为logo
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png',
            'filename': 'store-logo-chess-1.png',
            'description': '象棋主题logo'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            'filename': 'store-logo-mahjong-1.png',
            'description': '麻将主题logo'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/1946/1946488.png',
            'filename': 'store-logo-game-1.png',
            'description': '游戏主题logo'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2550/2550264.png',
            'filename': 'store-logo-building-1.png',
            'description': '建筑主题logo'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/619/619153.png',
            'filename': 'store-logo-location-1.png',
            'description': '位置主题logo'
        }
    ]
    
    print('开始下载门店logo...')
    print(f'总共需要下载 {len(store_logos)} 个logo')
    print('-' * 50)
    
    success_count = 0
    for i, logo in enumerate(store_logos, 1):
        print(f'[{i}/{len(store_logos)}] 正在下载: {logo["description"]}')
        if download_image(logo['url'], logo['filename'], logo['description']):
            success_count += 1
        
        # 添加延迟避免请求过快
        time.sleep(0.5)
    
    print('-' * 50)
    print(f'下载完成! 成功下载 {success_count}/{len(store_logos)} 个logo')
    
    if success_count > 0:
        print('\n✓ 门店logo已保存到 miniprogram/images/ 目录')
        print('✓ 现在可以为不同门店配置不同的logo了!')

if __name__ == '__main__':
    main()