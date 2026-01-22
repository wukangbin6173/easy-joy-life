#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简化版演示 - 只生成目录
"""

import requests
import json
import time

def call_api(prompt, max_tokens=2000):
    """调用 DeepSeek API"""
    api_key = "sk-33be56d16dfc46338eb606ec7f31b72f"
    url = "https://api.deepseek.com/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "deepseek-reasoner",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
        "temperature": 0.7
    }
    
    try:
        print("📡 正在调用 API...")
        response = requests.post(url, headers=headers, json=data, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            print(f"❌ API 错误: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ 请求失败: {e}")
        return None

def generate_outline():
    """生成小说目录"""
    print("🚀 DeepSeek 小说生成器演示")
    print("=" * 50)
    
    theme = "程序员获得修仙传承，在都市中修炼"
    print(f"📖 主题: {theme}")
    
    prompt = f"""请为一部都市修仙小说设计5章的目录。

主题：{theme}

要求：
1. 创作一个小说标题
2. 每章要有标题和50字概述
3. 情节要连贯

格式：
小说标题：《标题》

第1章：章节标题
概述：内容概述

第2章：章节标题
概述：内容概述

...以此类推"""
    
    print("\n📚 开始生成目录...")
    
    result = call_api(prompt, 2000)
    
    if result:
        print("✅ 目录生成成功！")
        print("=" * 50)
        print(result)
        
        # 保存到文件
        with open("demo_outline.txt", "w", encoding="utf-8") as f:
            f.write(f"主题：{theme}\n\n")
            f.write(result)
        
        print("\n💾 目录已保存到 demo_outline.txt")
        return True
    else:
        print("❌ 目录生成失败")
        return False

def generate_chapter():
    """生成单个章节示例"""
    print("\n📝 生成第一章内容...")
    
    prompt = """请为都市修仙小说《代码修仙传》写第1章内容。

第1章：意外觉醒
概述：程序员李明在加班时意外触碰古老键盘，获得修仙传承，开始修炼之路。

要求：
1. 2000字左右
2. 情节生动有趣
3. 描写细腻

请直接输出章节内容。"""
    
    result = call_api(prompt, 3000)
    
    if result:
        print("✅ 第一章生成成功！")
        
        # 保存章节
        with open("demo_chapter1.txt", "w", encoding="utf-8") as f:
            f.write("第1章 意外觉醒\n\n")
            f.write(result)
        
        print("💾 第一章已保存到 demo_chapter1.txt")
        print(f"📊 内容长度: {len(result)} 字符")
        return True
    else:
        print("❌ 第一章生成失败")
        return False

def main():
    print("🌟" * 20)
    print("   DeepSeek 小说生成器演示")
    print("🌟" * 20)
    
    # 1. 生成目录
    if generate_outline():
        print("\n" + "=" * 50)
        
        # 2. 询问是否生成章节
        print("🤔 是否继续生成第一章内容？")
        print("⚠️  注意：生成章节需要更长时间")
        
        try:
            choice = input("输入 y 继续，其他键跳过: ").strip().lower()
            if choice == 'y':
                generate_chapter()
            else:
                print("⏭️  跳过章节生成")
        except:
            print("⏭️  跳过章节生成")
    
    print("\n🎉 演示完成！")
    print("📁 生成的文件：")
    print("- demo_outline.txt (小说目录)")
    print("- demo_chapter1.txt (第一章，如果生成)")

if __name__ == "__main__":
    main()