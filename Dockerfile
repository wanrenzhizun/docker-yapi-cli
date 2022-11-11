FROM node:18.12.1-alpine3.16
RUN echo 'https://mirrors.aliyun.com/alpine/v3.16/main/' > /etc/apk/repositories  \
    && echo 'https://mirrors.aliyun.com/alpine/v3.16/community/' >>/etc/apk/repositories  \
    && apk --update add tzdata ttf-dejavu fontconfig  \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime  \
    && echo "Asia/Shanghai" > /etc/timezone  \
    && apk del tzdata  \
    && rm -rf /var/cache/apk/*

RUN mkdir -p /yapi/vendors

WORKDIR /yapi/vendors

COPY vendors/ /yapi/vendors/
COPY handle.js /yapi/vendors/
COPY start.sh /yapi/vendors/

RUN npm config set registry https://registry.npm.taobao.org
# 安装依赖
RUN npm install --production --registry https://registry.npm.taobao.org

ENTRYPOINT ["sh","start.sh"]



