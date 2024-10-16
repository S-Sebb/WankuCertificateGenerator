# -*- coding: utf-8 -*-
import os
from PIL import Image, ImageDraw, ImageFont


# 图像生成功能
def generate_text_overlay_image(text_list, config_list, image_path, output_filepath):
    # 加载图像
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)

    # 遍历 `text_list` 和对应的 `config_list`
    for idx, text in enumerate(text_list):
        if idx >= len(config_list):
            continue

        config = config_list[idx]

        font_path = os.path.join("fonts", config['font_path'])
        font = ImageFont.truetype(font_path, config['font_size'])

        # 绘制文本（横向或纵向）
        if config['text_orientation'] == "horizontal":
            # 计算文本的大小
            text_bbox = draw.textbbox((0, 0), text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]

            # 居中计算
            base_position_x = config['text_center_position']['x'] - text_width // 2
            base_position_y = config['text_center_position']['y'] - text_height // 2

            position = (base_position_x, base_position_y)
            for char in text:
                draw.text(position, char, font=font, fill=tuple(config['font_color']))
                text_bbox = draw.textbbox((0, 0), char, font=font)
                position = (
                    position[0] + text_bbox[2] - text_bbox[0] + config['text_spacing'], position[1])

        elif config['text_orientation'] == "vertical":
            # 计算文本的大小， 竖着写
            max_text_width = 0
            sum_text_height = 0
            for char in text:
                text_bbox = draw.textbbox((0, 0), char, font=font)
                sum_text_height += text_bbox[3] - text_bbox[1]
                max_text_width = max(max_text_width, text_bbox[2] - text_bbox[0])

            # 居中计算
            base_position_x = config['text_center_position']['x'] - max_text_width // 2
            base_position_y = config['text_center_position']['y'] - sum_text_height // 2

            position = (base_position_x, base_position_y)
            for char in text:
                draw.text(position, char, font=font, fill=tuple(config['font_color']))
                text_bbox = draw.textbbox((0, 0), char, font=font)
                position = (
                    position[0], position[1] + text_bbox[3] - text_bbox[1] + config['text_spacing'])

    # 如果图像像素数超过 700000，调整大小
    if image.width * image.height > 700000:
        image = resize_image_to_fit(image, 700000)

    image.save(output_filepath, format='JPEG', optimize=True, quality=85)


def resize_image_to_fit(image, max_pixels):
    width, height = image.size
    aspect_ratio = width / height
    new_height = int((max_pixels / aspect_ratio) ** 0.5)
    new_width = int(aspect_ratio * new_height)
    return image.resize((new_width, new_height), Image.Resampling.LANCZOS)
