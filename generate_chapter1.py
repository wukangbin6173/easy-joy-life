#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成第一章内容
"""

import requests
import json

def call_api(prompt, max_tokens=3000):
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
        print("📡 正在调用 API 生成章节内容...")
        print("⏳ 请耐心等待，deepseek-reasoner 需要推理时间...")
        
        response = requests.post(url, headers=headers, json=data, timeout=120)
        
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            print(f"❌ API 错误: {response.status_code}")
            print(f"📄 错误信息: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ 请求失败: {e}")
        return None

def generate_chapter1():
    """生成第一章"""
    print("📝 生成《码上升仙》第一章")
    print("=" * 50)
    
    prompt = """请为都市修仙小说《码上升仙》写第1章的详细内容。

第1章：加班夜的奇异U盘
概述：程序员林深在连续加班三天后，收到匿名快递中的古旧U盘。插入瞬间电流窜入眉心，庞大的《玄霄真法》传承强行灌注，随之而来的是一行浮动在眼前的警告："灵气复苏倒计时：7天"。

写作要求：
1. 字数2500-3500字
2. 情节生动有趣，对话自然
3. 描写细腻，有画面感
4. 体现程序员的职业特色
5. 修仙元素要合理融入现代背景

请直接输出章节正文内容，不需要其他格式。"""
    
    result = call_api(prompt, 4000)
    
    if result:
        print("✅ 第一章生成成功！")
        
        # 保存章节
        filename = "第01章_加班夜的奇异U盘.txt"
        with open(filename, "w", encoding="utf-8") as f:
            f.write("第1章 加班夜的奇异U盘\n\n")
            f.write(result)
        
        print(f"💾 第一章已保存到 {filename}")
        print(f"📊 内容长度: {len(result)} 字符")
        
        # 显示前500字预览
        print("\n📖 内容预览:")
        print("-" * 50)
        preview = result[:500] + "..." if len(result) > 500 else result
        print(preview)
        print("-" * 50)
        
        return True
    else:
        print("❌ 第一章生成失败")
        return False

if __name__ == "__main__":
    print("🌟" * 20)
    print("   《码上升仙》第一章生成")
    print("🌟" * 20)
    
    generate_chapter1()
    
    print("\n🎉 生成完成！")
    print("📁 查看文件: 第01章_加班夜的奇异U盘.txt")