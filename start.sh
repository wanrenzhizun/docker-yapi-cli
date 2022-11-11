#!/usr/bin/env bash
set -ex


echo "安装插件。。。"
node install_plugins.js

if [ -e init.lock ]; then
    echo "启动yapi。。。"
    node server/app.js
else
    echo "启动安装程序。。。"
    node handle.js
    npm run install-server
fi