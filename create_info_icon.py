from PIL import Image, ImageDraw

# 创建一个64x64的图片
size = 64
img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# 绘制圆形背景（蓝色）
color = '#1890ff'
draw.ellipse([4, 4, size-4, size-4], fill=color)

# 绘制白色的 "i" 字母
# 上面的点
draw.ellipse([26, 16, 38, 28], fill='white')

# 下面的竖线
draw.rectangle([28, 32, 36, 52], fill='white')

# 保存图片
img.save('miniprogram/images/info-icon.png', 'PNG')
print('✅ info-icon.png 创建成功')
