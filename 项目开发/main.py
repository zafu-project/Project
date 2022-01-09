# 打开WebODM
import subprocess
process = subprocess.Popen("docker start webapp webodm-node-odm-1 worker db broker", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
process.wait()
command_output = process.stdout.read().decode('utf-8')

