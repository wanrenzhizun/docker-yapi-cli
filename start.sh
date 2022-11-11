#!/usr/bin/env bash
set -ex

echo "安装插件..."
node install_plugins.js

if [ -e /yapi/init.lock ]; then
    echo "尝试启动Yapi..."
    node /yapi/vendors/server/app.js
else
    echo "启动安装程序..."
    node /yapi/vendors/handle.js
    npm run install-server
fi