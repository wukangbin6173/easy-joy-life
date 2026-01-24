#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
微信支付平台证书下载工具
通过API获取微信支付平台证书
"""

import requests
import json
import time
import hashlib
import base64
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend

class WechatPayCertDownloader:
    def __init__(self, mch_id, serial_no, private_key_path, api_v3_key):
        self.mch_id = mch_id
        self.serial_no = serial_no
        self.api_v3_key = api_v3_key
        
        # 加载商户私钥
        with open(private_key_path, 'rb') as f:
            self.private_key = serialization.load_pem_private_key(
                f.read(), password=None, backend=default_backend()
            )
    
    def generate_signature(self, method, url_path, timestamp, nonce_str, body=""):
        """生成签名"""
        sign_str = f"{method}\n{url_path}\n{timestamp}\n{nonce_str}\n{body}\n"
        signature = self.private_key.sign(
            sign_str.encode('utf-8'),
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        return base64.b64encode(signature).decode('utf-8')
    
    def get_authorization_header(self, method, url_path, body=""):
        """生成Authorization头"""
        timestamp = str(int(time.time()))
        nonce_str = str(int(time.time() * 1000))
        
        signature = self.generate_signature(method, url_path, timestamp, nonce_str, body)
        
        auth_header = (
            f'WECHATPAY2-SHA256-RSA2048 '
            f'mchid="{self.mch_id}",'
            f'nonce_str="{nonce_str}",'
            f'signature="{signature}",'
            f'timestamp="{timestamp}",'
            f'serial_no="{self.serial_no}"'
        )
        
        return auth_header
    
    def download_certificates(self):
        """下载微信支付平台证书"""
        url = "https://api.mch.weixin.qq.com/v3/certificates"
        
        headers = {
            'Authorization': self.get_authorization_header('GET', '/v3/certificates'),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'WechatPay-Certificate-Downloader/1.0'
        }
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            data = response.json()
            certificates = data.get('data', [])
            
            print(f"获取到 {len(certificates)} 个证书")
            
            for i, cert_info in enumerate(certificates):
                serial_number = cert_info['serial_no']
                encrypt_cert = cert_info['encrypt_certificate']
                
                print(f"\n证书 {i+1}:")
                print(f"序列号: {serial_number}")
                print(f"生效时间: {cert_info['effective_time']}")
                print(f"过期时间: {cert_info['expire_time']}")
                
                # 解密证书内容
                cert_content = self.decrypt_certificate(encrypt_cert)
                
                # 保存证书文件
                cert_filename = f"wechatpay_certificate_{serial_number}.pem"
                with open(cert_filename, 'w') as f:
                    f.write(cert_content)
                
                print(f"证书已保存: {cert_filename}")
            
            return certificates
            
        except requests.exceptions.RequestException as e:
            print(f"请求失败: {e}")
            return None
        except Exception as e:
            print(f"处理失败: {e}")
            return None
    
    def decrypt_certificate(self, encrypt_cert):
        """解密证书内容"""
        # 这里需要实现AES-256-GCM解密
        # 使用API v3密钥解密
        # 简化实现，实际需要完整的解密逻辑
        
        algorithm = encrypt_cert['algorithm']
        nonce = encrypt_cert['nonce']
        associated_data = encrypt_cert['associated_data']
        ciphertext = encrypt_cert['ciphertext']
        
        print(f"解密算法: {algorithm}")
        print("注意: 需要实现完整的AES-256-GCM解密逻辑")
        
        # 返回占位符内容
        return """-----BEGIN CERTIFICATE-----
# 这里应该是解密后的证书内容
# 需要实现完整的AES-256-GCM解密算法
-----END CERTIFICATE-----"""

def main():
    print("=" * 60)
    print("微信支付平台证书下载工具")
    print("=" * 60)
    
    # 配置信息（请替换为实际值）
    mch_id = "1234567890"  # 商户号
    serial_no = "你的商户证书序列号"  # 商户证书序列号
    private_key_path = "apiclient_key.pem"  # 商户私钥文件路径
    api_v3_key = "你的32位API_v3密钥"  # API v3密钥
    
    print("配置信息:")
    print(f"商户号: {mch_id}")
    print(f"证书序列号: {serial_no}")
    print(f"私钥文件: {private_key_path}")
    print(f"API v3密钥: {api_v3_key[:8]}****")
    
    downloader = WechatPayCertDownloader(mch_id, serial_no, private_key_path, api_v3_key)
    certificates = downloader.download_certificates()
    
    if certificates:
        print("\n✅ 证书下载完成！")
        print("\n使用说明:")
        print("1. 将下载的证书文件放到 backend/src/main/resources/cert/ 目录")
        print("2. 更新配置文件中的证书路径")
        print("3. 重启应用")
    else:
        print("\n❌ 证书下载失败！")
        print("\n建议:")
        print("1. 检查商户号、证书序列号、API v3密钥是否正确")
        print("2. 确认商户私钥文件路径正确")
        print("3. 使用SDK自动证书管理功能（推荐）")

if __name__ == "__main__":
    main()