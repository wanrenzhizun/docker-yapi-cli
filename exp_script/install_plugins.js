const { spawnSync } = require('child_process');
const fs = require('fs');

function exec(cmd,params) {
    spawnSync(cmd, params,{
        stdio: 'inherit'
    });
}

function installPlugins() {
    let npm = 'npm';
    let args = ['install']
    let registry = ["--registry", "https://registry.npm.taobao.org","--save"]

    const plugins = JSON.parse(process.env.YAPI_PLUGINS ?? "[]");

    const packages = plugins
        .map((plugin) => `yapi-plugin-${plugin.name}`)
        .filter(
            (packageName) =>
                !fs.existsSync(`/yapi/vendors/node_modules/${packageName}`),
        ) ?? []
    if (packages.length > 0) {
        let params = [...args, ...packages, ...registry]
        exec(npm, params)
        //重新编译插件，使插件生效
        console.log("重新编译插件，使插件生效。。。")
        exec(npm,['run','build-client'])
    }
}

installPlugins();


