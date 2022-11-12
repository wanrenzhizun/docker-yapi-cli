FROM node:14.17.2-alpine3.12
RUN echo 'https://mirrors.aliyun.com/alpine/v3.12/main/' > /etc/apk/repositories  \
    && echo 'https://mirrors.aliyun.com/alpine/v3.12/community/' >>/etc/apk/repositories  \
    && apk --update add tzdata ttf-dejavu fontconfig python2 make g++ bash \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime  \
    && echo "Asia/Shanghai" > /etc/timezone  \
    && apk del tzdata  \
    && rm -rf /var/cache/apk/*

RUN mkdir -p /yapi/vendors

WORKDIR /yapi/vendors

COPY vendors/ /yapi/vendors/

COPY exp_script/ /yapi/vendors/

RUN npm config set registry https://registry.npm.taobao.org

RUN npm install -g ykit node-gyp --registry https://registry.npm.taobao.org

RUN rm -rf package-lock.json
# 安装依赖
RUN npm install --registry https://registry.npm.taobao.org

ENTRYPOINT ["node","start.js"]



