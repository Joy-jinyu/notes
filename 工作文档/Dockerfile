FROM node:8.17.0
COPY ./ /root/easy-mock
WORKDIR /root/easy-mock
RUN npm config set registry https://registry.npm.taobao.org && npm install && npm run build && npm run start
EXPOSE 7300
