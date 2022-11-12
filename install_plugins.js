const { spawn } = require('child_process');
const fs = require('fs');
let cmd = 'npm';
let args = ['install','--production','--legacy-peer-deps']
let registry = ["--registry=https://registry.npm.taobao.org"]

const plugins = JSON.parse(process.env.YAPI_PLUGINS ?? "[]");

const packages = plugins
    .map((plugin) => `yapi-plugin-${plugin.name}`)
    .filter(
        (packageName) =>
            !fs.existsSync(`/yapi/vendors/node_modules/${packageName}`),
    )??[]
if (packages.length > 0){
    let params = [...args,...packages,...registry]
    const task = spawn(cmd, params);
    task.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    task.stderr.on('data', (data) => {
        console.log(`${data}`);
    });

    task.on('close', (code) => {
        console.log(`子进程退出码：${code}`);
    });
}


