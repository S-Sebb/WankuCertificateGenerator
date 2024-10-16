# -*- coding: utf-8 -*-
import json
import os
import sys
import time
from datetime import datetime, timedelta


# 配置文件加载部分
def load_settings(settings_file='settings.json'):
    if not os.path.exists(settings_file):
        empty_settings = {"web_root": "", "types": {}}
        with open(settings_file, 'w') as f:
            json.dump(empty_settings, f, indent=4)
        print(f"{settings_file} not found. A blank settings file has been created.")
        sys.exit(1)

    with open(settings_file, 'r') as f:
        settings = json.load(f)

    web_root = settings.get('web_root', '')
    if not web_root:
        print("Invalid settings in settings.json. Please update it with the correct values.")
        sys.exit(1)

    return settings


# 清理旧文件功能
def delete_old_files(directory, age_minutes):
    now = datetime.now()
    cutoff = now - timedelta(minutes=age_minutes)
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
            if file_time < cutoff:
                try:
                    os.remove(file_path)
                    print(f"Deleted old file: {file_path}")
                except Exception as e:
                    print(f"Error deleting file {file_path}: {e}")


# 定期清理功能
def periodic_cleanup(directory, interval_minutes, age_minutes):
    while True:
        delete_old_files(directory, age_minutes)
        time.sleep(interval_minutes * 60)
