#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
可视化小说生成器
解决编码问题，提供进度显示
"""

import requests
import json
import time
import os
import sys
from typing import List, Dict

class VisualNovelGenerator:
    def __init__(self, api_key: str, model: str = "deepseek-reasoner"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.deepseek.com/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json; charset=utf-8"
        }
        
    def print_progress_bar(self, current: int, total: int, description: str = ""):
        """显示进度条"""
        percent = (current / total) * 100
        bar_length = 40
        filled_length = int(bar_length * current // total)
        bar = '█' * filled_length + '-' * (bar_length - filled_length)
        
        print(f'\r{description} |{bar}| {percent:.1f}% ({current}/{total})', end='', flush=True)
        if current == total:
            print()  # 完成后换行
    
    def call_deepseek_api(self, prompt: str, max_tokens: int = 2000, description: str = "") -> str:
        """调用 DeepSeek API 并显示进度"""
        print(f"\n🚀 {description}")
        print("📡 正在调用 DeepSeek API...")
        
        data = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
            "temperature": 0.7
        }
        
        try:
            # 模拟进度
            for i in range(1, 4):
                self.print_progress_bar(i, 3, "发送请求")
                time.sleep(0.5)
            
            response = requests.post(
                self.base_url, 
                headers=self.headers, 
                json=data,
                timeout=60
            )
            response.raise_for_status()
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            print("✅ API 调用成功！")
            return content
            
        except requests.exceptions.RequestException as e:
            print(f"❌ API 调用失败: {e}")
            return ""
        except KeyError as e:
            print(f"❌ 响应格式错误: {e}")
            return ""
    
    def generate_outline(self, novel_theme: str, genre: str = "都市修仙", chapters: int = 15) -> Dict:
        """生成小说目录"""
        prompt = f"""请为一部{genre}小说设计{chapters}章的详细目录。

小说主题：{novel_theme}

要求：
1. 创作一个吸引人的小说标题
2. 每章都要有精彩的标题
3. 提供每章80-120字的内容概述
4. 确保章节间逻辑连贯，有完整的故事弧线

请严格按照以下JSON格式返回：
{{
    "novel_title": "小说标题",
    "genre": "{genre}",
    "total_chapters": {chapters},
    "chapters": [
        {{
            "chapter_number": 1,
            "title": "第一章标题",
            "summary": "第一章详细概述，80-120字"
        }},
        {{
            "chapter_number": 2,
            "title": "第二章标题", 
            "summary": "第二章详细概述，80-120字"
        }}
    ]
}}

请确保返回完整的{chapters}章内容。"""
        
        print("\n" + "="*60)
        print("📚 开始生成小说目录")
        print("="*60)
        
        response = self.call_deepseek_api(prompt, max_tokens=4000, description="生成小说目录")
        
        if not response:
            return {}
            
        try:
            # 尝试解析JSON
            outline_data = json.loads(response)
            print(f"✅ 目录生成成功！小说《{outline_data.get('novel_title', '未知')}》")
            return outline_data
        except json.JSONDecodeError:
            print("❌ 目录格式解析失败，尝试文本格式保存...")
            # 保存原始响应
            with open("raw_outline.txt", "w", encoding="utf-8") as f:
                f.write(response)
            return {"raw_response": response}
    
    def generate_chapter_content(self, novel_info: Dict, chapter_info: Dict, chapter_index: int, total_chapters: int) -> str:
        """生成章节内容"""
        novel_title = novel_info.get("novel_title", "未命名小说")
        
        prompt = f"""请为小说《{novel_title}》写第{chapter_info['chapter_number']}章的详细内容。

章节信息：
- 标题：{chapter_info['title']}
- 概述：{chapter_info['summary']}

写作要求：
1. 字数控制在2500-3500字
2. 情节生动有趣，对话自然流畅
3. 描写细腻，有强烈的画面感
4. 严格按照章节概述展开情节
5. 保持与整体故事风格一致

请直接输出章节正文内容，不需要额外格式。"""
        
        description = f"生成第{chapter_info['chapter_number']}章：{chapter_info['title']}"
        
        # 显示整体进度
        self.print_progress_bar(chapter_index, total_chapters, f"章节进度")
        
        content = self.call_deepseek_api(prompt, max_tokens=5000, description=description)
        return content
    
    def save_file(self, filename: str, content: str, description: str = ""):
        """保存文件并显示进度"""
        print(f"💾 {description}")
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ 文件已保存：{filename}")
        except Exception as e:
            print(f"❌ 文件保存失败：{e}")
    
    def generate_full_novel(self, novel_theme: str, genre: str = "都市修仙", chapters: int = 15):
        """生成完整小说"""
        print("\n" + "🌟"*20)
        print("   DeepSeek 可视化小说生成器")
        print("🌟"*20)
        
        print(f"\n📖 小说设定：")
        print(f"   主题：{novel_theme}")
        print(f"   类型：{genre}")
        print(f"   章节：{chapters}章")
        
        # 1. 生成目录
        outline_data = self.generate_outline(novel_theme, genre, chapters)
        if not outline_data:
            print("❌ 目录生成失败，程序终止")
            return
        
        # 保存目录
        outline_json = json.dumps(outline_data, ensure_ascii=False, indent=2)
        self.save_file("novel_outline.json", outline_json, "保存小说目录")
        
        # 如果是原始响应，不继续生成章节
        if "raw_response" in outline_data:
            print("⚠️  由于目录格式问题，请手动检查 raw_outline.txt 和 novel_outline.json")
            return
        
        novel_title = outline_data.get("novel_title", "未命名小说")
        chapters_list = outline_data.get("chapters", [])
        
        if not chapters_list:
            print("❌ 章节列表为空，无法继续生成")
            return
        
        print(f"\n📝 开始生成《{novel_title}》的章节内容...")
        print("="*60)
        
        # 创建章节文件夹
        chapters_dir = "chapters"
        if not os.path.exists(chapters_dir):
            os.makedirs(chapters_dir)
            print(f"📁 创建章节目录：{chapters_dir}")
        
        # 2. 生成每章内容
        total_chapters = len(chapters_list)
        for i, chapter_info in enumerate(chapters_list, 1):
            try:
                print(f"\n📄 第 {i}/{total_chapters} 章")
                
                content = self.generate_chapter_content(outline_data, chapter_info, i, total_chapters)
                
                if content:
                    # 保存章节
                    chapter_filename = f"{chapters_dir}/第{chapter_info['chapter_number']:02d}章_{chapter_info['title']}.txt"
                    full_content = f"第{chapter_info['chapter_number']}章 {chapter_info['title']}\n\n{content}"
                    
                    self.save_file(chapter_filename, full_content, f"保存第{chapter_info['chapter_number']}章")
                    
                    # 短暂延迟避免API限制
                    if i < total_chapters:
                        print("⏳ 等待2秒避免API限制...")
                        time.sleep(2)
                else:
                    print(f"❌ 第{chapter_info['chapter_number']}章生成失败")
                    
            except Exception as e:
                print(f"❌ 生成第{chapter_info['chapter_number']}章时出错: {e}")
                continue
        
        print("\n" + "🎉"*20)
        print(f"   《{novel_title}》生成完成！")
        print("🎉"*20)
        print(f"\n📊 生成统计：")
        print(f"   - 目录文件：novel_outline.json")
        print(f"   - 章节目录：{chapters_dir}/")
        print(f"   - 总章节数：{total_chapters}")


def main():
    # 配置信息
    API_KEY = "sk-33be56d16dfc46338eb606ec7f31b72f"
    MODEL = "deepseek-reasoner"
    
    # 创建生成器
    generator = VisualNovelGenerator(API_KEY, MODEL)
    
    # 用户输入
    print("=" * 60)
    print("🤖 DeepSeek 可视化小说生成器")
    print("=" * 60)
    
    try:
        novel_theme = input("📝 请输入小说主题: ").strip()
        if not novel_theme:
            novel_theme = "修仙者在现代都市隐藏身份，一边上班一边修炼"
            print(f"使用默认主题: {novel_theme}")
        
        genre = input("🎭 请输入小说类型 (默认: 都市修仙): ").strip() or "都市修仙"
        
        chapters_input = input("📚 请输入章节数量 (默认: 15): ").strip()
        try:
            chapters = int(chapters_input) if chapters_input else 15
        except ValueError:
            chapters = 15
            print("使用默认章节数: 15")
        
        # 生成小说
        generator.generate_full_novel(novel_theme, genre, chapters)
        
    except KeyboardInterrupt:
        print("\n\n⏹️  用户中断，程序退出")
    except Exception as e:
        print(f"\n❌ 程序出错: {e}")


if __name__ == "__main__":
    main()