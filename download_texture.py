import os
import re
import requests
from urllib.parse import urljoin

# 你的本地网页地址
BASE_URL = "http://127.0.0.1:5500/solaris-deepseek.html"
# 下载保存的目录名
DOWNLOAD_DIR = "solar_textures"

def download_resources():
    # 创建保存目录
    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)
        print(f"📁 已创建目录: {DOWNLOAD_DIR}")

    print(f"🔍 正在获取网页内容: {BASE_URL}")
    try:
        response = requests.get(BASE_URL)
        response.raise_for_status()
        html_content = response.text
    except Exception as e:
        print(f"❌ 无法连接到本地网页，请确保 Live Server 正在运行: {e}")
        return

    # 1. 查找 HTML 中引用的所有外部 JS 文件
    js_files = re.findall(r'<script\s+.*?src=["\'](.*?)["\']', html_content)
    
    # 将内联 HTML 内容也作为搜索目标（以防部分地址直接写在 HTML 的 <script> 标签里）
    scripts_content = [html_content]

    # 2. 获取所有外部 JS 文件的内容
    for js_file in js_files:
        js_url = urljoin(BASE_URL, js_file)
        print(f"📄 正在读取 JS 文件: {js_url}")
        try:
            js_response = requests.get(js_url)
            scripts_content.append(js_response.text)
        except Exception as e:
            print(f"⚠️ 无法获取 {js_url}: {e}")

    # 3. 正则匹配所有的在线图片 URL 
    # 匹配 http/https 开头，以 jpg/jpeg/png 结尾的链接
    texture_urls = set()
    url_pattern = re.compile(r'https?://[^\s"\'\`]+\.(?:jpg|jpeg|png)', re.IGNORECASE)
    
    for content in scripts_content:
        matches = url_pattern.findall(content)
        for match in matches:
            texture_urls.add(match)

    if not texture_urls:
        print("🤔 未在 HTML 或 JS 中找到在线的 jpg/png 纹理链接。")
        return

    print(f"\n🎯 共找到 {len(texture_urls)} 个在线纹理，准备下载：")
    
    # 4. 批量下载图片
    for url in texture_urls:
        # 从 URL 中提取文件名
        filename = url.split('/')[-1]
        # 如果 URL 带有参数（如 ?v=1），清理掉参数部分保留纯文件名
        filename = filename.split('?')[0] 
        filepath = os.path.join(DOWNLOAD_DIR, filename)
        
        print(f"⬇️ 正在下载: {filename} ...")
        try:
            img_data = requests.get(url).content
            with open(filepath, 'wb') as f:
                f.write(img_data)
        except Exception as e:
            print(f"❌ 下载失败 {url}: {e}")

    print(f"\n✅ 所有资源下载完毕！已保存在本地的 '{DOWNLOAD_DIR}' 文件夹中。")

if __name__ == "__main__":
    download_resources()