const child_process = require('child_process');
const fs = require('fs');
let cmd = 'npm i ';

const plugins = JSON.parse(process.env.YAPI_PLUGINS ?? "[]");

const packages = plugins
    .map((plugin) => `yapi-plugin-${plugin.name}`)
    .filter(
        (packageName) =>
            !fs.existsSync(`/yapi/vendors/node_modules/${packageName}`),
    )??[]
if (packages.length > 0){
    child_process.exec(cmd + packages.join(" "), (error, stdout, stderr) => {
        if (!error) {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
        } else {
            console.log(`${error}`);
        }
    });
}

