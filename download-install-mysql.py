#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MySQL 8.0.44 自动下载和安装脚本
使用BrightData搜索到的最新版本
"""

import os
import sys
import subprocess
import urllib.request
import hashlib
import time

def print_status(message):
    """打印状态信息"""
    print(f"[INFO] {message}")

def print_error(message):
    """打印错误信息"""
    print(f"[ERROR] {message}")

def print_success(message):
    """打印成功信息"""
    print(f"[SUCCESS] {message}")

def download_file(url, filename, expected_md5=None):
    """下载文件并验证MD5"""
    print_status(f"正在下载 {filename}...")
    
    try:
        # 下载文件
        urllib.request.urlretrieve(url, filename)
        print_success(f"下载完成: {filename}")
        
        # 验证MD5 (如果提供)
        if expected_md5:
            print_status("验证文件完整性...")
            with open(filename, 'rb') as f:
                file_hash = hashlib.md5(f.read()).hexdigest()
            
            if file_hash.lower() == expected_md5.lower():
                print_success("文件完整性验证通过")
            else:
                print_error(f"文件完整性验证失败! 期望: {expected_md5}, 实际: {file_hash}")
                return False
        
        return True
        
    except Exception as e:
        print_error(f"下载失败: {str(e)}")
        return False

def install_mysql(installer_path):
    """安装MySQL"""
    print_status("启动MySQL安装程序...")
    
    try:
        # 静默安装MySQL (需要管理员权限)
        cmd = [
            "msiexec", "/i", installer_path,
            "/quiet",
            "ADDLOCAL=ALL",
            "REMOVE=",
            "INSTALLDIR=C:\\Program Files\\MySQL\\MySQL Server 8.0\\",
            "DATADIR=C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Data\\",
            "SERVICENAME=MySQL80",
            "MYSQLTCPPORT=3306",
            "MYSQLROOTPASSWORD=root"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print_success("MySQL安装完成")
            return True
        else:
            print_error(f"MySQL安装失败: {result.stderr}")
            return False
            
    except Exception as e:
        print_error(f"安装过程出错: {str(e)}")
        return False

def start_mysql_service():
    """启动MySQL服务"""
    print_status("启动MySQL服务...")
    
    try:
        # 尝试启动MySQL80服务
        result = subprocess.run(["net", "start", "MySQL80"], 
                              capture_output=True, text=True)
        
        if result.returncode == 0:
            print_success("MySQL服务启动成功")
            return True
        else:
            # 尝试启动mysql服务
            result = subprocess.run(["net", "start", "mysql"], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print_success("MySQL服务启动成功")
                return True
            else:
                print_error(f"MySQL服务启动失败: {result.stderr}")
                return False
                
    except Exception as e:
        print_error(f"启动服务出错: {str(e)}")
        return False

def create_database():
    """创建项目数据库"""
    print_status("创建项目数据库...")
    
    try:
        # 创建数据库
        cmd = [
            "mysql", "-u", "root", "-proot", "-e",
            "CREATE DATABASE IF NOT EXISTS qiupai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print_success("数据库创建成功")
            return True
        else:
            print_error(f"数据库创建失败: {result.stderr}")
            return False
            
    except Exception as e:
        print_error(f"创建数据库出错: {str(e)}")
        return False

def import_test_data():
    """导入测试数据"""
    print_status("导入测试数据...")
    
    try:
        # 导入SQL文件
        sql_file = "backend/src/main/resources/mysql-init.sql"
        if not os.path.exists(sql_file):
            print_error(f"SQL文件不存在: {sql_file}")
            return False
        
        cmd = ["mysql", "-u", "root", "-proot", "qiupai_db"]
        
        with open(sql_file, 'r', encoding='utf-8') as f:
            result = subprocess.run(cmd, input=f.read(), text=True, 
                                  capture_output=True)
        
        if result.returncode == 0:
            print_success("测试数据导入成功")
            return True
        else:
            print_error(f"测试数据导入失败: {result.stderr}")
            return False
            
    except Exception as e:
        print_error(f"导入数据出错: {str(e)}")
        return False

def main():
    """主函数"""
    print("=" * 50)
    print("MySQL 8.0.44 自动下载和安装脚本")
    print("=" * 50)
    print()
    
    # MySQL安装包信息 (从BrightData搜索结果获取)
    mysql_info = {
        "web_installer": {
            "url": "https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-web-community-8.0.44.0.msi",
            "filename": "mysql-installer-web-community-8.0.44.0.msi",
            "md5": "f48ab9b8c2db55ee39ddf534d4581676",
            "size": "2.1M"
        },
        "full_installer": {
            "url": "https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-8.0.44.0.msi",
            "filename": "mysql-installer-community-8.0.44.0.msi",
            "md5": "338dce4ac543dfc280664c857d265e3e",
            "size": "558.3M"
        }
    }
    
    # 选择安装包类型
    print("选择MySQL安装包类型:")
    print("1. Web安装包 (2.1MB) - 需要网络连接")
    print("2. 完整安装包 (558.3MB) - 离线安装")
    print()
    
    choice = input("请选择 (1 或 2, 默认选择1): ").strip()
    if choice == "2":
        installer_info = mysql_info["full_installer"]
        print_status("选择完整安装包")
    else:
        installer_info = mysql_info["web_installer"]
        print_status("选择Web安装包")
    
    print()
    
    # 创建下载目录
    download_dir = "mysql-download"
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)
        print_status(f"创建下载目录: {download_dir}")
    
    installer_path = os.path.join(download_dir, installer_info["filename"])
    
    # 检查文件是否已存在
    if os.path.exists(installer_path):
        print_status(f"安装包已存在: {installer_path}")
    else:
        # 下载MySQL安装包
        if not download_file(installer_info["url"], installer_path, installer_info["md5"]):
            print_error("下载失败，退出安装")
            return False
    
    print()
    
    # 安装MySQL
    print_status("开始安装MySQL...")
    print("注意: 安装过程需要管理员权限")
    print("如果弹出UAC提示，请点击'是'")
    print()
    
    # 手动安装提示
    print("由于需要管理员权限和用户交互，请手动运行安装程序:")
    print(f"1. 双击运行: {installer_path}")
    print("2. 安装配置建议:")
    print("   - 选择 'Server only' 或 'Developer Default'")
    print("   - 配置类型: 'Development Computer'")
    print("   - 端口: 3306 (默认)")
    print("   - Root密码: root")
    print("   - 启动MySQL服务")
    print()
    
    input("安装完成后，按回车键继续...")
    
    # 验证安装
    print_status("验证MySQL安装...")
    
    # 检查MySQL命令是否可用
    try:
        result = subprocess.run(["mysql", "--version"], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print_success("MySQL命令行工具可用")
            print(f"版本信息: {result.stdout.strip()}")
        else:
            print_error("MySQL命令行工具不可用，请检查PATH环境变量")
            return False
    except FileNotFoundError:
        print_error("MySQL命令行工具不可用，请检查安装和PATH环境变量")
        return False
    
    # 启动MySQL服务
    if not start_mysql_service():
        print_error("MySQL服务启动失败")
        return False
    
    # 等待服务完全启动
    print_status("等待MySQL服务完全启动...")
    time.sleep(5)
    
    # 创建数据库
    if not create_database():
        print_error("数据库创建失败")
        return False
    
    # 导入测试数据
    if not import_test_data():
        print_error("测试数据导入失败")
        return False
    
    print()
    print("=" * 50)
    print("🎉 MySQL安装和配置完成!")
    print("=" * 50)
    print()
    print("📊 MySQL配置信息:")
    print("- 版本: MySQL 8.0.44")
    print("- 端口: 3306")
    print("- 用户名: root")
    print("- 密码: root")
    print("- 数据库: qiupai_db")
    print()
    print("📈 测试数据:")
    print("- 门店: 5个")
    print("- 房间: 13个")
    print()
    print("🚀 下一步操作:")
    print("1. 重启后端服务以连接MySQL")
    print("2. 将小程序切换到真实API模式")
    print("3. 访问管理后台验证数据")
    print()
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        if success:
            print_success("所有操作完成!")
        else:
            print_error("安装过程中出现错误")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n用户取消操作")
        sys.exit(1)
    except Exception as e:
        print_error(f"未预期的错误: {str(e)}")
        sys.exit(1)