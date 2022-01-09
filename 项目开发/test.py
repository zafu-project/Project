# # import os
# # images_path = "C:\\Users\\10313\\Desktop\\项目文件\\dataset_banana-odm\\dataset_banana-master\\images\\"
# # for filename in os.listdir(images_path):  # listdir的参数是文件夹的路径                                 # 此时的filename是文件夹中文件的名称
# #     ('images', (images_path + filename, open(images_path + filename, 'rb'), 'image/jpg'))
#
# import os
# images = []
# images_path = "C:\\Users\\10313\\Desktop\\项目文件\\dataset_banana-odm\\dataset_banana-master\\images\\"
# for filename in os.listdir(images_path):  # listdir的参数是文件夹的路径                                 # 此时的filename是文件夹中文件的名称
#     images.append(('images', (images_path + filename, open(images_path + filename, 'rb'), 'image/jpg')))
#
#
# # images = [
# #     ('images', ('C:\\Users\\10313\\Desktop\\项目文件\\dataset_banana-odm\\dataset_banana-master\\images\\DSC_0423.JPG', open('C:\\Users\\10313\\Desktop\\项目文件\\dataset_banana-odm\\dataset_banana-master\\images\\DSC_0423.JPG', 'rb'), 'image/jpg')),
# #     ('images', ('C:\\Users\\10313\\Desktop\\项目文件\\dataset_banana-odm\\dataset_banana-master\\images\\DSC_0424.JPG', open('C:\\Users\\10313\\Desktop\\项目文件\\dataset_banana-odm\\dataset_banana-master\\images\\DSC_0424.JPG', 'rb'), 'image/jpg')),
# #     # ...
# # ]
#
# print(images)

# WebODM api请求
import requests
import os
import json
import sys
import time


# 登录请求
res = requests.post('http://localhost:8000/api/token-auth/',
                    data={'username': 'lee',
                          'password': 'lc10011001'}).json()
token = res['token']

# 创建新project
res = requests.post('http://localhost:8000/api/projects/',
                    headers={'Authorization': 'JWT {}'.format(token)},
                    data={'name': 'banana!'}).json()
project_id = res['id']


# 添加图片
images = []
images_path = "C:\\Users\\10313\\Desktop\\项目文件\\ODM-Data\\banana\\images\\"
for filename in os.listdir(images_path):  # listdir的参数是图片文件夹的路径，filename是文件夹中图片的名称
    images.append(('images', (images_path + filename, open(images_path + filename, 'rb'), 'image/jpg')))


# 生成正射影像
options = json.dumps([
    {'name': "orthophoto-resolution", 'value': 24}  # 正射分辨率：24
])

res = requests.post('http://localhost:8000/api/projects/{}/tasks/'.format(project_id),
                    headers={'Authorization': 'JWT {}'.format(token)},
                    files=images,
                    data={
                'options': options
                    }).json()

task_id = res['id']


# 使用循环定期检查任务状态
start = time.time()  # 获取运行开始时间戳
while True:
    res = requests.get('http://localhost:8000/api/projects/{}/tasks/{}/'.format(project_id, task_id),
                       headers={'Authorization': 'JWT {}'.format(token)}).json()

    if res['status'] == 40:
        print("进程运行完成！")
        break
    elif res['status'] == 10:
        wait = time.time()
        print("进程已经上传队列，正在等待处理...  运行时间: {}秒".format(round(wait - start)))
        time.sleep(5)
    else:
        end = time.time()  # 获取运行结束时间戳
        print("进程运行中，请等待...  运行时间: {}秒".format(round(end - start)))
        print(res['status'])
        time.sleep(5)


# 正射影像的下载保存
res = requests.get("http://localhost:8000/api/projects/{}/tasks/{}/download/orthophoto.tif".format(project_id, task_id),
                   headers={'Authorization': 'JWT {}'.format(token)},
                   stream=True)
with open("正射影像.tif", 'wb') as f:
    for chunk in res.iter_content(chunk_size=1024):
        if chunk:
            f.write(chunk)
print("正射影像.tif   已经保存")

# 点云的下载保存
res = requests.get("http://localhost:8000/api/projects/{}/tasks/{}/download/georeferenced_model.laz".format(project_id, task_id),
                   headers={'Authorization': 'JWT {}'.format(token)},
                   stream=True)
with open("点云.laz", 'wb') as f:
    for chunk in res.iter_content(chunk_size=1024):
        if chunk:
            f.write(chunk)
print("点云.las   已经保存")

# dsm的下载保存
res = requests.get("http://localhost:8000/api/projects/{}/tasks/{}/download/textured_model.zip".format(project_id, task_id),
                   headers={'Authorization': 'JWT {}'.format(token)},
                   stream=True)
with open("dsm.zip", 'wb') as f:
    for chunk in res.iter_content(chunk_size=1024):
        if chunk:
            f.write(chunk)
print("dsm.zip   已经保存")
