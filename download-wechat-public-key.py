#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
微信支付公钥下载工具
根据微信支付官方文档，帮助商户下载微信支付公钥
"""

import os
import sys
import requests
import json
import time
from datetime import datetime

def print_instructions():
    """打印获取微信支付公钥的详细步骤"""
    print("=" * 80)
    print("🔑 微信支付公钥获取指南")
    print("=" * 80)
    print()
    print("📋 步骤说明：")
    print("1. 登录微信支付商户平台 (https://pay.weixin.qq.com)")
    print("2. 进入【账户中心】-> 【API安全】")
    print("3. 找到【微信支付公钥】部分")
    print("4. 点击【申请公钥】或【下载公钥】")
    print("5. 下载得到两个文件：")
    print("   - 公钥文件 (wechatpay_public_key.pem)")
    print("   - 公钥ID (格式: PUB_KEY_ID_xxxxxxxxxxxxxxxxx)")
    print()
    print("📁 文件放置位置：")
    print("   - 将公钥文件放到: backend/src/main/resources/cert/wechatpay_public_key.pem")
    print("   - 记录公钥ID，需要配置到 application.yml 中")
    print()
    print("⚠️  重要提醒：")
    print("   - 微信支付公钥是微信官方提供的，不是商户自己生成的")
    print("   - 公钥ID格式固定为: PUB_KEY_ID_ 开头的字符串")
    print("   - 使用公钥模式可以避免平台证书过期问题")
    print()
    print("🔧 配置示例：")
    print("   在 application.yml 中配置：")
    print("   wechat:")
    print("     pay:")
    print("       public-key-path: classpath:cert/wechatpay_public_key.pem")
    print("       public-key-id: PUB_KEY_ID_你的公钥ID")
    print()

def check_cert_directory():
    """检查证书目录是否存在"""
    cert_dir = "backend/src/main/resources/cert"
    if not os.path.exists(cert_dir):
        print(f"📁 创建证书目录: {cert_dir}")
        os.makedirs(cert_dir, exist_ok=True)
    return cert_dir

def check_existing_files():
    """检查现有的证书文件"""
    cert_dir = check_cert_directory()
    
    print("🔍 检查现有证书文件...")
    
    # 检查商户私钥
    private_key_path = os.path.join(cert_dir, "apiclient_key.pem")
    if os.path.exists(private_key_path):
        print(f"✅ 商户私钥文件存在: {private_key_path}")
    else:
        print(f"❌ 商户私钥文件不存在: {private_key_path}")
    
    # 检查商户证书
    cert_path = os.path.join(cert_dir, "apiclient_cert.pem")
    if os.path.exists(cert_path):
        print(f"✅ 商户证书文件存在: {cert_path}")
    else:
        print(f"❌ 商户证书文件不存在: {cert_path}")
    
    # 检查微信支付公钥
    public_key_path = os.path.join(cert_dir, "wechatpay_public_key.pem")
    if os.path.exists(public_key_path):
        print(f"✅ 微信支付公钥文件存在: {public_key_path}")
        
        # 读取公钥内容预览
        try:
            with open(public_key_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.strip().split('\n')
                if len(lines) > 2:
                    print(f"   📄 公钥预览: {lines[0]}")
                    print(f"   📄 公钥长度: {len(lines)} 行")
        except Exception as e:
            print(f"   ⚠️  读取公钥文件失败: {e}")
    else:
        print(f"❌ 微信支付公钥文件不存在: {public_key_path}")
        print("   👆 这是需要从商户平台下载的文件")

def validate_public_key_format(file_path):
    """验证公钥文件格式"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
        
        # 检查PEM格式
        if not content.startswith('-----BEGIN PUBLIC KEY-----'):
            print("❌ 公钥文件格式错误：应该以 '-----BEGIN PUBLIC KEY-----' 开头")
            return False
        
        if not content.endswith('-----END PUBLIC KEY-----'):
            print("❌ 公钥文件格式错误：应该以 '-----END PUBLIC KEY-----' 结尾")
            return False
        
        print("✅ 公钥文件格式验证通过")
        return True
        
    except Exception as e:
        print(f"❌ 验证公钥文件失败: {e}")
        return False

def main():
    """主函数"""
    print_instructions()
    
    # 检查现有文件
    check_existing_files()
    
    print()
    print("=" * 80)
    print("🚀 下一步操作建议")
    print("=" * 80)
    
    cert_dir = "backend/src/main/resources/cert"
    public_key_path = os.path.join(cert_dir, "wechatpay_public_key.pem")
    
    if os.path.exists(public_key_path):
        print("✅ 微信支付公钥文件已存在")
        
        # 验证文件格式
        if validate_public_key_format(public_key_path):
            print()
            print("📝 请确保在 application.yml 中正确配置了公钥ID：")
            print("   wechat:")
            print("     pay:")
            print("       public-key-id: PUB_KEY_ID_你的实际公钥ID")
            print()
            print("🔄 然后重新编译部署后端服务：")
            print("   1. 停止当前后端服务")
            print("   2. 重新编译: mvn clean package")
            print("   3. 重新部署到服务器")
            print("   4. 测试微信支付功能")
        
    else:
        print("📥 请按照上述步骤从商户平台下载微信支付公钥")
        print(f"📁 下载后请将公钥文件放置到: {public_key_path}")
        print()
        print("💡 提示：")
        print("   - 如果商户平台没有【微信支付公钥】选项，可能需要先申请开通")
        print("   - 新商户号通常默认支持公钥模式")
        print("   - 老商户号可能需要手动切换到公钥模式")

if __name__ == "__main__":
    main()