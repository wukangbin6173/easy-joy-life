#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
微信支付 API v3密钥生成工具
生成符合要求的32位随机密钥
"""

import random
import string
import secrets

def generate_api_v3_key():
    """生成32位API v3密钥"""
    # 方法1: 使用secrets模块（推荐，更安全）
    characters = string.ascii_letters + string.digits
    key1 = ''.join(secrets.choice(characters) for _ in range(32))
    
    # 方法2: 使用random模块
    key2 = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    
    # 方法3: 混合大小写字母和数字
    key3 = ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=32))
    
    return key1, key2, key3

def main():
    print("=" * 50)
    print("微信支付 API v3密钥生成工具")
    print("=" * 50)
    
    key1, key2, key3 = generate_api_v3_key()
    
    print(f"\n推荐密钥1 (最安全): {key1}")
    print(f"推荐密钥2:         {key2}")
    print(f"推荐密钥3:         {key3}")
    
    print("\n" + "=" * 50)
    print("使用说明:")
    print("1. 选择其中一个密钥")
    print("2. 复制到微信商户平台设置")
    print("3. 同时更新到你的配置文件中")
    print("4. 妥善保管，不要泄露！")
    print("=" * 50)

if __name__ == "__main__":
    main()