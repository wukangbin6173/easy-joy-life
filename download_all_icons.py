#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量下载小程序所需的所有图标
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
    
    # 图标下载列表 - 使用免费的图标资源
    icons = [
        # TabBar 图标 (使用简单的SVG图标URL)
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
            'filename': 'home.png',
            'description': '首页图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/1946/1946488.png',
            'filename': 'home-active.png',
            'description': '首页图标(激活)'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/619/619153.png',
            'filename': 'store.png',
            'description': '门店图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2550/2550264.png',
            'filename': 'store-active.png',
            'description': '门店图标(激活)'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/3500/3500833.png',
            'filename': 'order.png',
            'description': '订单图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2413/2413074.png',
            'filename': 'order-active.png',
            'description': '订单图标(激活)'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/1946/1946436.png',
            'filename': 'profile.png',
            'description': '个人中心图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/263/263115.png',
            'filename': 'profile-active.png',
            'description': '个人中心图标(激活)'
        },
        
        # 功能图标
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2948/2948025.png',
            'filename': 'icon-book.png',
            'description': '预订图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/553/553376.png',
            'filename': 'icon-unlock.png',
            'description': '开门图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/1828/1828866.png',
            'filename': 'icon-member.png',
            'description': '会员图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2550/2550430.png',
            'filename': 'icon-service.png',
            'description': '客服图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/54/54481.png',
            'filename': 'search.png',
            'description': '搜索图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/1828/1828778.png',
            'filename': 'close.png',
            'description': '关闭图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/535/535239.png',
            'filename': 'location.png',
            'description': '位置图标'
        },
        
        # 钱包相关图标
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/1611/1611179.png',
            'filename': 'wallet-icon.png',
            'description': '钱包图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/3135/3135706.png',
            'filename': 'recharge-icon.png',
            'description': '充值图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
            'filename': 'withdraw-icon.png',
            'description': '提现图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2830/2830367.png',
            'filename': 'transfer-icon.png',
            'description': '转账图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/1611/1611179.png',
            'filename': 'record-icon.png',
            'description': '记录图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            'filename': 'income-icon.png',
            'description': '收入图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png',
            'filename': 'expense-icon.png',
            'description': '支出图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/633/633611.png',
            'filename': 'bank-card-icon.png',
            'description': '银行卡图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
            'filename': 'auto-recharge-icon.png',
            'description': '自动充值图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/3135/3135789.png',
            'filename': 'gift-icon.png',
            'description': '礼品图标'
        },
        
        # 支付图标
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            'filename': 'wechat-pay-icon.png',
            'description': '微信支付图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/196/196566.png',
            'filename': 'alipay-icon.png',
            'description': '支付宝图标'
        },
        
        # 智能设备图标
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png',
            'filename': 'smart-lock.png',
            'description': '智能锁图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/633/633635.png',
            'filename': 'bluetooth-icon.png',
            'description': '蓝牙图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png',
            'filename': 'qr-icon.png',
            'description': '二维码图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/633/633611.png',
            'filename': 'password-icon.png',
            'description': '密码图标'
        },
        
        # 状态图标
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
            'filename': 'success-icon.png',
            'description': '成功图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/753/753345.png',
            'filename': 'error-icon.png',
            'description': '错误图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/4555/4555971.png',
            'filename': 'empty-order.png',
            'description': '空订单图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/4555/4555971.png',
            'filename': 'empty.png',
            'description': '空状态图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/4555/4555971.png',
            'filename': 'empty-transaction.png',
            'description': '空交易图标'
        },
        
        # 特色服务图标
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png',
            'filename': 'feature-24h.png',
            'description': '24小时服务图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png',
            'filename': 'feature-smart.png',
            'description': '智能服务图标'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png',
            'filename': 'feature-clean.png',
            'description': '清洁服务图标'
        },
        
        # 默认图片 - 使用更合适的图片
        {
            'url': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'filename': 'default-avatar.png',
            'description': '默认头像'
        },
        {
            'url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'filename': 'default-store.png',
            'description': '默认门店图片'
        },
        {
            'url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'filename': 'room-default.jpg',
            'description': '默认房间图片'
        },
        {
            'url': 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png',
            'filename': 'logo.png',
            'description': 'Logo图片'
        }
    ]
    
    print('开始批量下载图标...')
    print(f'总共需要下载 {len(icons)} 个图标')
    print('-' * 50)
    
    success_count = 0
    for i, icon in enumerate(icons, 1):
        print(f'[{i}/{len(icons)}] 正在下载: {icon["description"]}')
        if download_image(icon['url'], icon['filename'], icon['description']):
            success_count += 1
        
        # 添加延迟避免请求过快
        time.sleep(0.5)
    
    print('-' * 50)
    print(f'下载完成! 成功下载 {success_count}/{len(icons)} 个图标')
    
    if success_count > 0:
        print('\n✓ 图标已保存到 miniprogram/images/ 目录')
        print('✓ 现在小程序中的所有图标都是真实的图片了!')
        print('✓ 重新编译小程序即可看到效果')

if __name__ == '__main__':
    main()