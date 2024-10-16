import logging
import os
import threading
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler

from flask import Flask, request, jsonify

from image_process import generate_text_overlay_image
from utils import load_settings, periodic_cleanup

app = Flask(__name__)


# 日志配置部分
def setup_logging(log_dir="logs"):
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    log_handler = TimedRotatingFileHandler(os.path.join(log_dir, "app.log"), when="midnight",
                                           interval=1)
    log_handler.suffix = "%Y-%m-%d"
    log_handler.setLevel(logging.INFO)
    log_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    log_handler.setFormatter(log_formatter)

    app.logger.addHandler(log_handler)
    app.logger.setLevel(logging.INFO)


# 生成图像的路由
@app.route('/generate-image', methods=['POST'])
def generate_image():
    app.logger.info("Received a request to generate an image")

    if not request.is_json:
        app.logger.error("Request content type is not application/json")
        return jsonify(
            {"error": "Bad Request", "message": "Content type must be application/json"}), 400

    try:
        data = request.get_json()
        text_list = data['text_list']
        type_key = data.get('type')
        app.logger.info(f"Text to overlay: {text_list}, Type: {type_key}")
    except Exception as e:
        app.logger.error(f"Error parsing request JSON: {e}")
        return jsonify({"error": "Bad Request", "message": str(e)}), 400

    # 确保 `type` 存在于 `settings` 中
    if type_key not in settings['types']:
        app.logger.error(f"Type '{type_key}' not found in settings.")
        return jsonify(
            {"error": "Bad Request", "message": f"Type '{type_key}' not found in settings."}), 400

    # 从 settings 中获取相应的配置
    config = settings['types'][type_key]
    image_path = os.path.join("images", config['image_path'])
    config_list = config['text_config']

    output_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}.jpg"
    output_filepath = os.path.join(output_dir, output_filename)

    # 生成图像并获取文件名
    generate_text_overlay_image(text_list=text_list, config_list=config_list,
                                                  image_path=image_path,
                                                  output_filepath=output_filepath)

    app.logger.info(f"Image generated successfully: {output_filename}")

    # 返回图像URL
    return jsonify({"image_url": f"https://www.wankuwang.com/output/{output_filename}"})


# 启动服务和清理线程
if __name__ == '__main__':
    setup_logging()

    settings = load_settings()  # 从 utils.py 中导入
    web_root = settings['web_root']

    # 确保图像输出目录存在
    output_dir = os.path.join(web_root, "output")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # 启动清理旧文件的后台线程
    cleanup_thread = threading.Thread(target=periodic_cleanup,
                                      args=(output_dir, 1, 5))  # 从 utils.py 中导入
    cleanup_thread.daemon = True
    cleanup_thread.start()

    app.logger.info("Starting Flask server...")
    app.run(host='127.0.0.1', port=5000)
