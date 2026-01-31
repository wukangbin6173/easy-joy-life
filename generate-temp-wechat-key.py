#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
微信支付证书检查和临时解决方案工具
"""

import os
import sys
from datetime import datetime

def print_header():
    """打印工具标题"""
    print("=" * 80)
    print("🔑 微信支付证书检查工具")
    print("=" * 80)
    print()

def check_certificate_files():
    """检查证书文件状态"""
    cert_dir = "backend/src/main/resources/cert"
    
    print("📁 检查证书文件...")
    print(f"证书目录: {cert_dir}")
    print()
    
    files_to_check = [
        ("apiclient_cert.pem", "商户API证书（公钥）"),
        ("apiclient_key.pem", "商户API私钥 ⭐关键文件"),
        ("wechatpay_public_key.pem", "微信支付公钥")
    ]
    
    missing_files = []
    
    for filename, description in files_to_check:
        filepath = os.path.join(cert_dir, filename)
        if os.path.exists(filepath):
            print(f"✅ {filename} - {description}")
            # 检查文件大小
            size = os.path.getsize(filepath)
            print(f"   📊 文件大小: {size} 字节")
            
            # 检查文件内容格式
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if filename == "apiclient_key.pem":
                        if "-----BEGIN PRIVATE KEY-----" in content:
                            print("   ✅ 私钥格式正确")
                        elif "-----BEGIN RSA PRIVATE KEY-----" in content:
                            print("   ✅ RSA私钥格式正确")
                        else:
                            print("   ❌ 私钥格式可能有问题")
                    elif "-----BEGIN" in content:
                        print("   ✅ PEM格式正确")
            except Exception as e:
                print(f"   ⚠️  文件读取异常: {e}")
        else:
            print(f"❌ {filename} - {description}")
            print(f"   📍 缺失路径: {filepath}")
            missing_files.append(filename)
        print()
    
    return missing_files

def create_temp_solution():
    """创建临时解决方案"""
    print("🔧 临时解决方案选项:")
    print()
    
    print("1️⃣  禁用微信支付，使用支付宝支付")
    print("   - 修改配置文件禁用微信支付")
    print("   - 支付宝配置完整，可以正常使用")
    print()
    
    print("2️⃣  创建测试用的模拟私钥文件")
    print("   - 仅用于测试，不能用于生产环境")
    print("   - 可以让应用正常启动")
    print()
    
    print("3️⃣  从微信商户平台下载真实证书")
    print("   - 推荐方案，获取真实的API证书")
    print("   - 可以正常使用微信支付功能")
    print()
    
    choice = input("请选择解决方案 (1/2/3): ").strip()
    
    if choice == "1":
        disable_wechat_pay()
    elif choice == "2":
        create_mock_key()
    elif choice == "3":
        show_download_guide()
    else:
        print("❌ 无效选择")

def disable_wechat_pay():
    """禁用微信支付"""
    print()
    print("🔧 禁用微信支付配置...")
    
    config_file = "backend/src/main/resources/application-prod.yml"
    
    print(f"📝 需要修改文件: {config_file}")
    print()
    print("添加以下配置:")
    print("```yaml")
    print("wechat:")
    print("  pay:")
    print("    enabled: false  # 禁用微信支付")
    print("```")
    print()
    print("✅ 这样应用可以正常启动，只使用支付宝支付")

def create_mock_key():
    """创建模拟私钥文件"""
    print()
    print("🔧 创建测试用模拟私钥文件...")
    
    cert_dir = "backend/src/main/resources/cert"
    key_file = os.path.join(cert_dir, "apiclient_key.pem")
    
    # 创建一个模拟的私钥文件（仅用于测试）
    mock_key_content = """-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5jsRIzMzMzMzM
zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM
zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM
zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM
zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM
zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM
zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM
zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM
zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM
MOCK_PRIVATE_KEY_FOR_TESTING_ONLY_DO_NOT_USE_IN_PRODUCTION
-----END PRIVATE KEY-----"""
    
    try:
        os.makedirs(cert_dir, exist_ok=True)
        with open(key_file, 'w', encoding='utf-8') as f:
            f.write(mock_key_content)
        
        print(f"✅ 模拟私钥文件已创建: {key_file}")
        print()
        print("⚠️  重要提醒:")
        print("   - 这是测试用的模拟文件，不能用于生产环境")
        print("   - 微信支付功能仍然无法正常工作")
        print("   - 应用可以正常启动，避免初始化错误")
        print("   - 请尽快从微信商户平台下载真实证书")
        
    except Exception as e:
        print(f"❌ 创建模拟文件失败: {e}")

def show_download_guide():
    """显示下载指南"""
    print()
    print("📋 微信支付API证书下载步骤:")
    print()
    print("1. 登录微信支付商户平台")
    print("   🌐 https://pay.weixin.qq.com")
    print("   🔑 商户号: 1554487931")
    print()
    print("2. 进入API安全页面")
    print("   📍 账户中心 → API安全 → API证书")
    print()
    print("3. 下载证书")
    print("   📥 点击【下载证书】")
    print("   🔐 输入操作密码")
    print("   📦 下载压缩包")
    print()
    print("4. 解压并使用")
    print("   📁 解压得到 apiclient_key.pem")
    print("   📂 放到: backend/src/main/resources/cert/")
    print("   🚀 重新部署应用")
    print()
    print("💡 如需帮助，请联系微信支付技术支持")

def main():
    """主函数"""
    print_header()
    
    # 检查证书文件
    missing_files = check_certificate_files()
    
    if not missing_files:
        print("🎉 所有证书文件都存在！")
        print("✅ 微信支付应该可以正常工作")
        return
    
    print(f"❌ 缺失 {len(missing_files)} 个证书文件:")
    for filename in missing_files:
        print(f"   - {filename}")
    print()
    
    if "apiclient_key.pem" in missing_files:
        print("🔑 缺少关键的商户API私钥文件")
        print("   这会导致微信支付服务初始化失败")
        print()
        
        create_temp_solution()
    
    print()
    print("=" * 80)
    print("📞 需要帮助？")
    print("   - 查看详细指南: 微信支付API证书获取指南.md")
    print("   - 联系微信支付技术支持")
    print("=" * 80)

if __name__ == "__main__":
    main()