#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
下载棋牌室轮播图片
"""

import requests
import os
from urllib.parse import urlparse

def download_image(url, filename):
    """下载图片"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()
        
        # 确保目录存在
        os.makedirs('miniprogram/images', exist_ok=True)
        
        filepath = f'miniprogram/images/{filename}'
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f'成功下载: {filename}')
        return True
        
    except Exception as e:
        print(f'下载失败 {filename}: {e}')
        return False

def main():
    """主函数"""
    # 选择的图片URL (这些是Unsplash的免费图片)
    images = [
        {
            'url': 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
            'filename': 'banner1.jpg',
            'description': '扑克牌游戏场景'
        },
        {
            'url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
            'filename': 'banner2.jpg',
            'description': '麻将游戏场景'
        }
    ]
    
    print('开始下载棋牌室轮播图片...')
    
    success_count = 0
    for img in images:
        print(f'正在下载: {img["description"]}')
        if download_image(img['url'], img['filename']):
            success_count += 1
    
    print(f'\n下载完成! 成功下载 {success_count}/{len(images)} 张图片')
    
    if success_count > 0:
        print('\n图片已保存到 miniprogram/images/ 目录')
        print('现在可以在小程序中使用这些轮播图了!')

if __name__ == '__main__':
    main()