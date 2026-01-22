#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DeepSeek 小说生成器
使用 DeepSeek API 生成小说目录和章节内容
"""

import requests
import json
import time
import os
from typing import List, Dict

class NovelGenerator:
    def __init__(self, api_key: str, model: str = "deepseek-reasoner"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.deepseek.com/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def call_deepseek_api(self, prompt: str, max_tokens: int = 2000) -> str:
        """调用 DeepSeek API"""
        data = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": max_tokens,
            "temperature": 0.7
        }
        
        try:
            response = requests.post(self.base_url, headers=self.headers, json=data)
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except requests.exceptions.RequestException as e:
            print(f"API 调用失败: {e}")
            return ""
        except KeyError as e:
            print(f"响应格式错误: {e}")
            return ""
    
    def generate_outline(self, novel_theme: str, genre: str = "玄幻", chapters: int = 20) -> List[Dict]:
        """生成小说目录"""
        prompt = f"""
请为一部{genre}小说设计详细的章节目录。

小说主题：{novel_theme}
章节数量：{chapters}章

要求：
1. 每个章节都要有吸引人的标题
2. 提供每章的简要内容概述（50-100字）
3. 确保章节之间有逻辑连贯性
4. 情节要有起承转合

请按以下JSON格式返回：
{{
    "novel_title": "小说标题",
    "chapters": [
        {{
            "chapter_number": 1,
            "title": "章节标题",
            "summary": "章节内容概述"
        }}
    ]
}}
"""
        
        print("正在生成小说目录...")
        response = self.call_deepseek_api(prompt, max_tokens=3000)
        
        try:
            # 尝试解析JSON
            outline_data = json.loads(response)
            return outline_data
        except json.JSONDecodeError:
            print("目录生成失败，返回格式不正确")
            return {}
    
    def generate_chapter_content(self, novel_title: str, chapter_info: Dict, previous_summary: str = "") -> str:
        """生成章节内容"""
        prompt = f"""
小说标题：{novel_title}
章节：第{chapter_info['chapter_number']}章 {chapter_info['title']}
章节概述：{chapter_info['summary']}

{f"前情提要：{previous_summary}" if previous_summary else ""}

请写出这一章的详细内容，要求：
1. 字数在2000-3000字左右
2. 情节生动有趣，对话自然
3. 描写细腻，有画面感
4. 与章节概述保持一致
5. 如果有前情提要，要与之衔接自然

请直接输出章节内容，不需要其他格式。
"""
        
        print(f"正在生成第{chapter_info['chapter_number']}章内容...")
        content = self.call_deepseek_api(prompt, max_tokens=4000)
        return content
    
    def save_outline_to_file(self, outline_data: Dict, filename: str = "novel_outline.json"):
        """保存目录到文件"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(outline_data, f, ensure_ascii=False, indent=2)
        print(f"目录已保存到 {filename}")
    
    def save_chapter_to_file(self, chapter_number: int, title: str, content: str, folder: str = "chapters"):
        """保存章节到文件"""
        if not os.path.exists(folder):
            os.makedirs(folder)
        
        filename = f"{folder}/第{chapter_number:02d}章_{title}.txt"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"第{chapter_number}章 {title}\n\n")
            f.write(content)
        print(f"第{chapter_number}章已保存到 {filename}")
    
    def generate_full_novel(self, novel_theme: str, genre: str = "玄幻", chapters: int = 20):
        """生成完整小说"""
        # 1. 生成目录
        outline_data = self.generate_outline(novel_theme, genre, chapters)
        if not outline_data:
            print("目录生成失败，程序终止")
            return
        
        # 2. 保存目录
        self.save_outline_to_file(outline_data)
        
        novel_title = outline_data.get("novel_title", "未命名小说")
        chapters_list = outline_data.get("chapters", [])
        
        print(f"\n小说《{novel_title}》目录生成完成！")
        print("=" * 50)
        
        # 3. 生成每章内容
        previous_summary = ""
        for i, chapter_info in enumerate(chapters_list):
            try:
                # 生成章节内容
                content = self.generate_chapter_content(novel_title, chapter_info, previous_summary)
                
                if content:
                    # 保存章节
                    self.save_chapter_to_file(
                        chapter_info['chapter_number'], 
                        chapter_info['title'], 
                        content
                    )
                    
                    # 更新前情提要（使用当前章节的概述）
                    previous_summary = chapter_info['summary']
                    
                    # 避免API调用过于频繁
                    time.sleep(2)
                else:
                    print(f"第{chapter_info['chapter_number']}章生成失败")
                    
            except Exception as e:
                print(f"生成第{chapter_info['chapter_number']}章时出错: {e}")
                continue
        
        print(f"\n小说《{novel_title}》生成完成！")


def main():
    # 配置信息
    API_KEY = "sk-33be56d16dfc46338eb606ec7f31b72f"
    MODEL = "deepseek-reasoner"
    
    # 创建生成器
    generator = NovelGenerator(API_KEY, MODEL)
    
    # 用户输入
    print("=== DeepSeek 小说生成器 ===")
    novel_theme = input("请输入小说主题（例如：修仙者在现代都市的冒险）: ")
    genre = input("请输入小说类型（默认：玄幻）: ") or "玄幻"
    chapters_input = input("请输入章节数量（默认：20）: ")
    
    try:
        chapters = int(chapters_input) if chapters_input else 20
    except ValueError:
        chapters = 20
    
    print(f"\n开始生成小说...")
    print(f"主题: {novel_theme}")
    print(f"类型: {genre}")
    print(f"章节数: {chapters}")
    print("=" * 50)
    
    # 生成小说
    generator.generate_full_novel(novel_theme, genre, chapters)


if __name__ == "__main__":
    main()