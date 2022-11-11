const fs = require('fs');

function prettyFormat(str) {
    try {
        // 设置缩进为2个空格
        str = JSON.stringify(JSON.parse(str), null, 2);
        str = str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return match;
        });
    } catch (e) {
        alert("异常信息:" + e);
    }
}

function createConfig() {
    let config = {
        "port": 3000,
        "adminAccount": process.env.ADMIN_ACCOUNT ?? "admin@admin.com",
        "adminPassword": process.env.ADMIN_PASSWORD ?? "admin123",
        "timeout": 120000,
        "closeRegister": process.env.CLOSE_REGISTER ?? true,
    };
    const db = {
        "servername": process.env.DB_SERVERNAME ?? "127.0.0.1",
        "DATABASE": process.env.DB_NAME ?? "yapi",
        "port": JSON.parse(process.env.DB_PORT ?? 27017),
        "user": process.env.DB_USER ?? "",
        "pass": process.env.DB_PASS ?? "",
        "authSource": process.env.DB_AUTH_SOURCE ?? ""
    };
    const mail = {
        "enable": JSON.parse(process.env.MAIL_ENABLE ?? false),
        "host": process.env.MAIL_HOST ?? "smtp.163.com",
        "port": JSON.parse(process.env.MAIL_PORT ?? 465),
        "from": process.env.MAIL_FORM ?? "",
        "auth": {
            "user": process.env.MAIL_USER ?? "",
            "pass": process.env.MAIL_PASS ?? ""
        }
    };
    const ldap = {
        "enable": JSON.parse(process.env.LDAP_ENABLE ?? false),
        "server": process.env.LDAP_SERVER ?? "",
        "baseDn": process.env.LDAP_BASE_DN ?? "CN=Admin,CN=Users,DC=test,DC=com",
        "bindPassword": process.env.LDAP_BIND_PASSWORD ?? "password123",
        "searchDn": process.env.LDAP_SEARCH_DN ?? "OU=UserContainer,DC=test,DC=com",
        "searchStandard": process.env.LDAP_SEARCH_STANDARD ?? "mail",    // 自定义格式： "searchStandard": "&(objectClass=user)(cn=%s)"
        "emailPostfix": process.env.LDAP_EMAILPOSTFIX ?? "",
        "emailKey": process.env.LDAP_EMAILKEY ?? "mail",
        "usernameKey": process.env.LDAP_USERNAMEKEY ?? "name"
    };
    const plugins = JSON.parse(process.env.YAPI_PLUGINS ?? "[]");

    config.db = db;

    if (mail.enable){
        config.mail = mail;
    }
    if (ldap.enable){
        config.ldapLogin = ldap;
    }
    config.plugins = plugins

    let str = prettyFormat(JSON.stringify(config))

    fs.writeFile('../config.json', str, function (err) {
        if (err) {
            console.error(err);
        }
    })
}
createConfig()

