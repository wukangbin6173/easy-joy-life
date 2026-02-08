"""
创建增强版银行 Logo
使用银行品牌色和首字母
"""
from PIL import Image, ImageDraw, ImageFont
import os

# 创建目录
output_dir = "miniprogram/images/banks"
os.makedirs(output_dir, exist_ok=True)

# 银行信息
banks = {
    "icbc": {"name": "工商银行", "abbr": "工行", "color": "#C8161D"},
    "ccb": {"name": "建设银行", "abbr": "建行", "color": "#003D7C"},
    "abc": {"name": "农业银行", "abbr": "农行", "color": "#00843D"},
    "boc": {"name": "中国银行", "abbr": "中行", "color": "#B8292F"},
    "cmb": {"name": "招商银行", "abbr": "招行", "color": "#D32F2F"},
    "comm": {"name": "交通银行", "abbr": "交行", "color": "#0066B3"},
    "psbc": {"name": "邮储银行", "abbr": "邮储", "color": "#00853F"},
    "cib": {"name": "兴业银行", "abbr": "兴业", "color": "#003D7C"},
    "spdb": {"name": "浦发银行", "abbr": "浦发", "color": "#003D7C"},
    "citic": {"name": "中信银行", "abbr": "中信", "color": "#D32F2F"}
}

def create_bank_logo(bank_code, bank_info, size=200):
    """创建银行 logo"""
    # 创建圆角矩形背景
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # 绘制圆角矩形背景
    corner_radius = 20
    draw.rounded_rectangle(
        [(0, 0), (size, size)],
        radius=corner_radius,
        fill=bank_info['color']
    )
    
    # 添加文字（使用系统字体）
    try:
        # 尝试使用中文字体
        font_size = 60
        try:
            font = ImageFont.truetype("msyh.ttc", font_size)  # 微软雅黑
        except:
            try:
                font = ImageFont.truetype("simhei.ttf", font_size)  # 黑体
            except:
                font = ImageFont.load_default()
        
        # 计算文字位置（居中）
        text = bank_info['abbr']
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (size - text_width) / 2
        y = (size - text_height) / 2 - 5
        
        # 绘制文字
        draw.text((x, y), text, fill='white', font=font)
        
    except Exception as e:
        print(f"  警告: 无法添加文字 - {str(e)}")
    
    # 保存
    output_path = os.path.join(output_dir, f"{bank_code}.png")
    img.save(output_path, 'PNG')
    print(f"✅ {bank_info['name']:8s} -> {output_path}")

# 创建所有银行 logo
print("创建银行 Logo...")
print("=" * 60)

for bank_code, bank_info in banks.items():
    create_bank_logo(bank_code, bank_info)

print("=" * 60)
print(f"✅ 完成！共创建 {len(banks)} 个银行 Logo")
print(f"📁 保存位置: {output_dir}")
