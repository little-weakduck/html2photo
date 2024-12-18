import json
from flask import Flask, request, send_file, abort
import os
import time
import subprocess
import threading
import urllib.parse

app = Flask(__name__)

@app.route('/convert', methods=['POST'])
def convert_html_to_image():
    data = request.data
    
    data = data.decode("utf-8")
    data = json.loads(data)

    # 获取 HTML 字符串
    html_string = data.get("html")
    
        # 解码 URL 编码的 HTML 字符串
    html_string = urllib.parse.unquote(html_string)



    # 创建一个唯一的文件名
    image_filename = f"image_{int(time.time())}.png"
    image_path = os.path.join("images", image_filename)
    html_filename = f"template_{int(time.time())}.html"
    html_path = os.path.join("html", html_filename)

    # 使用 PhantomJS 将 HTML 字符串转换为图片
    with open(html_path, "w") as f:
        f.write(html_string)
    subprocess.run(["phantomjs", "render.js", html_path, image_path])

    # 创建一个指向图片的链接
    link = f"http://82.156.18.208:4455/images/{image_filename}"

    # 设置定时器，在 5 分钟后删除图片
    def delete_image():
        time.sleep(300)  # 5 分钟
        if os.path.exists(image_path):
            os.remove(image_path)
        if os.path.exists(html_path):
            os.remove(html_path)

    # 启动定时器线程
    timer_thread = threading.Thread(target=delete_image)
    timer_thread.start()

    return link, 200, {'Content-Type': 'text/plain'}

@app.route('/images/<path:filename>')
def serve_image(filename):
    image_path = os.path.join("images", filename)
    if os.path.exists(image_path):
        return send_file(image_path, mimetype='image/png')
    else:
        abort(404)
        
@app.route('/icons/<path:filename>')
def serve_css(filename):
    image_path = os.path.join("icons", filename)
    if os.path.exists(image_path):
        #svg
        return send_file(image_path, mimetype='image/svg+xml')
    else:
        abort(404)

@app.route('/<path:path>')
def error():
    return "404 Not Found", 404, {'Content-Type': 'text/plain'}
if __name__ == '__main__':
    if not os.path.exists("images"):
        os.makedirs("images")
    if not os.path.exists("html"):
        os.makedirs("html")
    app.run(host='0.0.0.0',debug=True,port=4455)