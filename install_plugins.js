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
if (fs.existsSync(`/yapi/init.lock`)){
    console.log("尝试启动Yapi")
    require('/yapi/vendors/server/app.js');
}else {
    console.log("启动安装程序。。。");
    require('/yapi/vendors/handle.js');
    child_process.exec("npm run install-server", (error, stdout, stderr) => {
        if (!error) {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
        } else {
            console.log(`${error}`);
        }
    });
}


