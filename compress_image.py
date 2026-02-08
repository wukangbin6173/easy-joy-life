from PIL import Image
import os

input_path = r"d:\wukangbin\资料\yyzz.jpg"
output_path = r"d:\wukangbin\资料\yyzz_compressed.jpg"

# 打开图片
img = Image.open(input_path)

# 获取原始大小
original_size = os.path.getsize(input_path) / (1024 * 1024)
print(f"原始大小: {original_size:.2f} MB")
print(f"原始尺寸: {img.size}")

# 目标大小 5MB
target_size_mb = 5
quality = 85

# 先尝试用质量压缩
while quality > 10:
    img.save(output_path, "JPEG", quality=quality, optimize=True)
    current_size = os.path.getsize(output_path) / (1024 * 1024)
    
    if current_size <= target_size_mb:
        print(f"\n压缩成功!")
        print(f"压缩后大小: {current_size:.2f} MB")
        print(f"使用质量: {quality}")
        print(f"保存路径: {output_path}")
        break
    
    quality -= 5

# 如果质量压缩不够，尝试缩小尺寸
if current_size > target_size_mb:
    print("\n质量压缩不够，尝试缩小尺寸...")
    scale = 0.9
    while scale > 0.3:
        new_size = (int(img.size[0] * scale), int(img.size[1] * scale))
        resized_img = img.resize(new_size, Image.Resampling.LANCZOS)
        resized_img.save(output_path, "JPEG", quality=85, optimize=True)
        current_size = os.path.getsize(output_path) / (1024 * 1024)
        
        if current_size <= target_size_mb:
            print(f"\n压缩成功!")
            print(f"压缩后大小: {current_size:.2f} MB")
            print(f"压缩后尺寸: {new_size}")
            print(f"保存路径: {output_path}")
            break
        
        scale -= 0.05
