# docker-YApi

在 [Docker](https://www.docker.com/) 中运行 [YApi](https://github.com/YMFE/yapi)。

---

演示地址： [https://docker-yapi.herokuapp.com/](https://docker-yapi.herokuapp.com/)

管理员账号：`admin@docker.yapi`

管理员密码：`adm1n`

仅供测试，服务每次部署都会重置，请不要将重要数据放在上面。

---

<!-- TOC depthFrom:2 -->

- [要求](#要求)
- [安装](#安装)
- [如何配置](#如何配置)
    - [通过 config.json 或者 config.js 配置（不推荐）](#通过-configjson-或者-configjs-配置不推荐)
    - [通过环境变量配置（推荐）](#通过环境变量配置推荐)
        - [基础配置](#基础配置)
        - [数据库配置](#数据库配置)
        - [邮件配置](#邮件配置)
        - [LDAP 登录配置](#ldap-登录配置)
        - [插件配置](#插件配置)
- [内置插件](#内置插件)
- [如何重启](#如何重启)
- [如何升级](#如何升级)
- [查看日志](#查看日志)
- [如何迁移](#如何迁移)
- [play 版说明](#play-版说明)
- [YApi 相关资源推荐](#yapi-相关资源推荐)
- [许可](#许可)

<!-- /TOC -->

## 要求

你得确保在你的设备上安装了不是太老版本的 [`Docker`](https://docs.docker.com/install/linux/docker-ce/centos/#install-docker-ce) 和 [`Docker Compose`](https://docs.docker.com/compose/install/)。

## 安装

首先，克隆本项目：

```bash
git clone https://github.com/fjc0k/docker-YApi.git

# 无法访问 github 的可使用国内镜像：
git clone https://gitee.com/fjc0k/docker-YApi.git
```

接下来，修改 `docker-compose.yml` 中 `yapi-web` 下的环境变量 `YAPI_ADMIN_ACCOUNT` 为你的管理员邮箱，`YAPI_ADMIN_PASSWORD` 为你的管理员密码。

最后，执行 `docker-compose up -d` 启动服务。

然后，通过 `http://localhost:40001` 即可访问 `YApi`。

## 如何配置

为了减少二次配置，`docker-YApi` 新增了 `adminPassword` 选项以设置管理员密码。

### 通过 config.json 或者 config.js 配置（不推荐）

`config.json` 是 YApi 官方支持的配置文件，`config.js` 是 `docker-YApi` 扩展支持的配置文件，其实就是将 JSON 数据写成了更简洁的 JavaScript 对象。

你可通过将外部的 `config.json` 或 `config.js` 配置文件映射进容器内部来使用它们：

```bash
./config.json:/yapi/config.json
./config.js:/yapi/config.js
```

### 通过环境变量配置（推荐）

通过环境变量配置的选项会覆盖通过 `config.json` 或者 `config.js` 配置的选项。

#### 基础配置

| 环境变量名称        | 类型    | 说明                                                                                         | 示例                            |
|---------------------|---------|--------------------------------------------------------------------------------------------|---------------------------------|
| ADMIN_ACCOUNT  | string  | 管理员账号（邮箱）                                                                             | admin@foo.bar                   |
| ADMIN_PASSWORD | string  | 管理员密码                                                                                   | adm1n                           |
| CLOSE_REGISTER | boolean | 是否关闭注册，由于 docker-YApi 已[内置相关插件](#内置插件)，你可在关闭注册后在后台手动添加用户 | true                            |

#### 数据库配置

| 环境变量名称                 | 类型   | 说明                                                                                                                                                                | 示例                                                            |
|------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| DB_SERVERNAME          | string | MongoDB 服务地址                                                                                                                                                    | yapi-mongo                                                      |
| DB_PORT                | number | MongoDB 服务端口                                                                                                                                                    | 27017                                                           |
| DB_NAME                | string | 使用的 MongoDB 数据库                                                                                                                                               | yapi                                                            |
| DB_USER           | string | 登录 MongoDB 服务的用户名                                                                                                                                           | root                                                            |
| DB_PASS           | string | 登录 MongoDB 服务的用户密码                                                                                                                                         | r00t                                                            |
| DB_AUTH_SOURCE    | string | MongoDB 身份认证所用库                                                                                                                                              | admin                                                           |
| DB_SLAVE_URL | string | 使用 MongoDB 集群时配置                                                                                                                                             | mongodb://127.0.0.100:8418,127.0.0.101:8418/yapidb?slaveOk=true |

#### 邮件配置

| 环境变量名称    | 类型    | 说明                                                                                                         | 示例                                 |
|-----------|---------|------------------------------------------------------------------------------------------------------------|--------------------------------------|
| MAIL_ENABLE | boolean | 是否启用                                                                                                     | true                                 |
| MAIL_HOST | string  | 邮件服务地址                                                                                                 | smtp.163.com                         |
| MAIL_PORT | number  | 邮件服务端口                                                                                                 | 465                                  |
| MAIL_FROM | string  | 发送人邮箱                                                                                                   | foo@163.com                          |
| MAIL_USER | string  | 登录邮件服务的用户名                                                                                         | bar@163.com                          |
| MAIL_PASS | string  | 登录邮件服务的用户密码                                                                                       | f00bar                               |

#### LDAP 登录配置

[点击查看 YApi 仓库下 LDAP 相关的 issues 👉](https://github.com/YMFE/yapi/issues?utf8=%E2%9C%93&q=ldap)

| 环境变量名称                  | 类型    | 说明                                                                                                                                                   | 示例                   |
|-------------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|
| LDAP_ENABLE             | boolean | 是否启用                                                                                                                                               | true                   |
| LDAP_LOGIN_SERVER       | string  | LDAP 服务地址                                                                                                                                          | ldap://ldap.foo.bar    |
| LDAP_BASE_DN      | string  | 登录 LDAP 服务的用户名                                                                                                                                 | cn=admin,dc=foo,dc=bar |
| LDAP_BIND_PASSWORD | string  | 登录 LDAP 服务的用户密码                                                                                                                               | f00bar                 |
| LDAP_SEARCH_DN    | string  | 查询用户数据的路径                                                                                                                                     | ou=users,dc=foo,dc=bar |
| LDAP_SEARCH_STANDARD | string  | 支持两种值：<br />1、前端登录账号对应的查询字段，如：`mail`、`uid` 等；<br />2、自定义查询条件，其中 `%s` 会被前端登录账号替换，如：`&(objectClass=user)(cn=%s)` | -                      |
| LDAP_EMAIL_POSTFIX | string  | 登录邮箱后缀                                                                                                                                           | @163.com               |
| LDAP_EMAIL_KEY    | string  | LDAP 数据库存储用户邮箱的字段                                                                                                                          | mail                   |
| LDAP_USERNAME_KEY | string  | LDAP 数据库存储用户名的字段                                                                                                                            | name                   |

#### 插件配置

| 环境变量名称 | 类型 | 说明                                                                                                                                                                                                                                                                                                                                                                                                                  | 示例                             |
|--------------|------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| YAPI_PLUGINS | json | 要使用的插件列表。[点击查看开源 YApi 插件列表 →](https://www.npmjs.com/search?q=yapi-plugin-)<br /><br />**配置项数据格式：**<br />{<br /> "name": "插件名称，必须去除前缀 yapi-plugin-",<br /> "options": "插件配置，没有配置则不必设置"<br />}<br /><br />**注意：**<br />安装插件会运行 YApi 自带的打包命令，其内存消耗较大，因此，在安装插件时，物理机可用内存最好大于等于 `4GB`，否则，易出现内存溢出错误，导致插件安装失败。 | [{"name":"gitlab","options":{}}] |

## 内置插件

为 YApi 安装插件是一件异常缓慢且易因服务器配置不够而出错的事情，因此 docker-YApi 内置了以下插件，希望能减少点不必要的麻烦：

- [yapi-plugin-add-user](https://github.com/congqiu/yapi-plugin-add-user): 支持管理员直接通过邮箱添加用户。 <作者: [@congqiu](https://github.com/congqiu)>


## 如何重启

若你修改了配置，务必重启应用才能生效：

```bash
docker-compose restart yapi-web
```

## 如何升级

若 `YApi` 有更新，本项目应会尽快跟进，之后，你可使用以下命令升级：

```bash
docker-compose pull yapi-web \
  && docker-compose down \
  && docker-compose up -d
```

> 升级不会对原有数据造成任何影响！

## 查看日志

如果出现意外情况，你可通过以下命令查看运行日志：

```bash
docker-compose logs yapi-web
```


## YApi 相关资源推荐

- [YApi-X 浏览器插件](https://github.com/fjc0k/YApi-X/tree/master/chrome-extension#readme)

  为 YApi-X 开发的浏览器跨域与文件上传插件，同时支持 YApi 官方版。


## 许可
