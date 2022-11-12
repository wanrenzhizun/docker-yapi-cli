#!/usr/bin/env bash
set -ex

if [ ! -e /yapi/init.lock ]; then
    echo "启动安装程序..."
    node /yapi/vendors/handle.js
    npm run install-server || echo "初始化数据库失败，请确认。。。"
fi

echo "安装插件..."
node install_plugins.js

echo "尝试启动Yapi..."
node /yapi/vendors/server/app.js