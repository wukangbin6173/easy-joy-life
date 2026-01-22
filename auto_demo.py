#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动化演示版本 - 预设参数运行
"""

import sys
import os

# 添加当前目录到路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from visual_novel_generator import VisualNovelGenerator

def main():
    # 配置信息
    API_KEY = "sk-33be56d16dfc46338eb606ec7f31b72f"
    MODEL = "deepseek-reasoner"
    
    # 预设参数
    novel_theme = "一个普通程序员意外获得修仙传承，在现代都市中一边写代码一边修炼，遇到各种超自然事件和敌人"
    genre = "都市修仙"
    chapters = 8  # 减少章节数以节省时间
    
    print("🚀 自动化演示开始！")
    print("=" * 60)
    print(f"📖 小说主题: {novel_theme}")
    print(f"🎭 小说类型: {genre}")
    print(f"📚 章节数量: {chapters}")
    print("=" * 60)
    
    # 创建生成器
    generator = VisualNovelGenerator(API_KEY, MODEL)
    
    try:
        # 生成小说
        generator.generate_full_novel(novel_theme, genre, chapters)
        
        print("\n🎉 演示完成！请查看生成的文件：")
        print("- novel_outline.json (小说目录)")
        print("- chapters/ (章节文件夹)")
        
    except KeyboardInterrupt:
        print("\n⏹️ 用户中断演示")
    except Exception as e:
        print(f"\n❌ 演示出错: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()