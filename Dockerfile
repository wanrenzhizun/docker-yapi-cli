FROM node:16-alpine3.12
RUN echo 'https://mirrors.aliyun.com/alpine/v3.12/main/' > /etc/apk/repositories  \
    && echo 'https://mirrors.aliyun.com/alpine/v3.12/community/' >>/etc/apk/repositories  \
    && apk --update add tzdata ttf-dejavu fontconfig python2 \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime  \
    && echo "Asia/Shanghai" > /etc/timezone  \
    && apk del tzdata  \
    && rm -rf /var/cache/apk/*

RUN mkdir -p /yapi/vendors

WORKDIR /yapi/vendors

COPY vendors/ /yapi/vendors/
COPY handle.js /yapi/vendors/
COPY install_plugins.js /yapi/vendors/
COPY start.sh /yapi/vendors/

RUN npm config set registry https://registry.npm.taobao.org
# 安装依赖
RUN npm install --production --registry https://registry.npm.taobao.org

ENTRYPOINT ["sh","start.sh"]



