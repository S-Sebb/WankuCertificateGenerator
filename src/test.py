import os

from image_process import generate_text_overlay_image
from utils import load_settings


# 主程序
def main():
    settings = load_settings()

    # 创建输出目录
    output_dir = "test_output"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # 固定文本列表
    text_list = ["思程", "刘蔚"]

    # 程序运行目录
    base_dir = os.getcwd()

    # 遍历所有 types
    for type_key, config in settings['types'].items():
        try:
            image_path = os.path.join(base_dir, "images", config['image_path'])
            text_configs = config['text_config']  # 获取文本配置列表

            # 生成文件名，根据图片类型选择合适的扩展名
            extension = "gif" if image_path.lower().endswith(".gif") else "jpg"
            output_filename = f"{type_key}_test.{extension}"
            output_filepath = os.path.join(output_dir, output_filename)

            # 生成图片
            generate_text_overlay_image(text_list=text_list, config_list=text_configs,
                                        image_path=image_path, output_filepath=output_filepath)

            print(f"Generated image for type '{type_key}' saved as '{output_filepath}'")
        except Exception as e:
            print(f"Error generating image for type '{type_key}': {e}")
            continue


if __name__ == '__main__':
    main()
