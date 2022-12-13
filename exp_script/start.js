const {spawnSync, spawn} = require('child_process');
const fs = require('fs');

function exec(cmd, params) {
    const task = spawn(cmd, params);
    task.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    task.stderr.on('data', (data) => {
        console.log(`${data}`);
    });

    task.on('close', (code) => {
        console.log(`初始化数据库进程退出码：${code}`);
    });
    return task
}

function execSync(cmd, params) {
    spawnSync(cmd, params, {
        stdio: 'inherit'
    });
}

function installPlugins() {
    let npm = 'npm';
    let args = ['install']
    let registry = ["--registry", "https://registry.npm.taobao.org", "--save"]

    const plugins = JSON.parse(process.env.YAPI_PLUGINS ?? "[]");

    const packages = plugins
        .map((plugin) => `yapi-plugin-${plugin.name}`)
        .filter(
            (packageName) =>
                !fs.existsSync(`/yapi/vendors/node_modules/${packageName}`),
        ) ?? []
    if (packages.length > 0) {
        let params = [...args, ...packages, ...registry]
        execSync(npm, params)
        //重新编译插件，使插件生效
        console.log("重新编译插件，使插件生效。。。")
        execSync(npm, ['run', 'build-client'])
    }
}

function otherHandle() {
    const ignoreArr = JSON.parse(process.env.IGNORE_PATH ?? "[]");
    if (ignoreArr.length > 0) {
        ignoreArr.push('/api/user/login_by_ldap')
        let replacement = "'" + ignoreArr.join("',\n'") + "'"
        let handleFile = "/yapi/vendors/server/controllers/base.js"
        fs.readFile(handleFile, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            let result = data.replace("'/api/user/login_by_ldap'", replacement);

            fs.writeFile(handleFile, result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
    }

}

function initDb() {
    return new Promise(resolve => {
        let ts = exec("npm", ["run", "install-server"])
        setTimeout(() => {
            if (!fs.existsSync("/yapi/init.lock")) {
                console.log("创建数据库失败！")
                fs.appendFile("/yapi/init.lock", "", () => {
                    exec("kill", ["-9", ts.pid])
                    resolve()
                });

            } else {
                resolve()
            }
        }, 5000)
    })

}

async function start() {
    if (!fs.existsSync("/yapi/init.lock")) {
        console.log("初始化程序")
        execSync("node", ["/yapi/vendors/handle.js"])
        await initDb()
    }

    console.log("安装插件")
    installPlugins()
    otherHandle()

    console.log("启动应用")
    require('/yapi/vendors/server/app.js');

}

start();


