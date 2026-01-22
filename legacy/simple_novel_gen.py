#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简化版 DeepSeek 小说生成器
"""

import requests
import json

# 配置
API_KEY = "sk-33be56d16dfc46338eb606ec7f31b72f"
MODEL = "deepseek-reasoner"
BASE_URL = "https://api.deepseek.com/v1/chat/completions"

def call_deepseek(prompt, max_tokens=2000):
    """调用 DeepSeek API"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
        "temperature": 0.7
    }
    
    response = requests.post(BASE_URL, headers=headers, json=data)
    result = response.json()
    return result["choices"][0]["message"]["content"]

def generate_outline():
    """生成小说目录"""
    theme = input("请输入小说主题: ")
    genre = input("请输入类型（默认玄幻）: ") or "玄幻"
    chapters = int(input("请输入章节数（默认15）: ") or "15")
    
    prompt = f"""
请为一部{genre}小说设计{chapters}章的详细目录。

主题：{theme}

要求：
1. 每章要有吸引人的标题
2. 提供每章50-100字的内容概述
3. 情节要连贯，有起承转合

格式：
第1章：标题
概述：内容概述

第2章：标题  
概述：内容概述

...以此类推
"""
    
    print("正在生成目录...")
    outline = call_deepseek(prompt, 3000)
    
    # 保存目录
    with open("小说目录.txt", "w", encoding="utf-8") as f:
        f.write(f"小说主题：{theme}\n")
        f.write(f"类型：{genre}\n")
        f.write(f"章节数：{chapters}\n\n")
        f.write(outline)
    
    print("目录已保存到 '小说目录.txt'")
    return outline

def generate_chapter():
    """生成单个章节"""
    chapter_num = input("请输入章节号: ")
    chapter_title = input("请输入章节标题: ")
    chapter_summary = input("请输入章节概述: ")
    
    prompt = f"""
请写出小说的第{chapter_num}章内容。

章节：第{chapter_num}章 {chapter_title}
概述：{chapter_summary}

要求：
1. 字数2000-3000字
2. 情节生动，对话自然
3. 描写细腻有画面感
4. 符合章节概述

请直接输出章节内容。
"""
    
    print(f"正在生成第{chapter_num}章...")
    content = call_deepseek(prompt, 4000)
    
    # 保存章节
    filename = f"第{chapter_num}章_{chapter_title}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"第{chapter_num}章 {chapter_title}\n\n")
        f.write(content)
    
    print(f"章节已保存到 '{filename}'")

def main():
    print("=== DeepSeek 小说生成器 ===")
    print("1. 生成小说目录")
    print("2. 生成单个章节")
    
    choice = input("请选择功能 (1/2): ")
    
    if choice == "1":
        generate_outline()
    elif choice == "2":
        generate_chapter()
    else:
        print("无效选择")

if __name__ == "__main__":
    main()