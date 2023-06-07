FROM alpine:latest
RUN apk add --update tzdata && \
cp /usr/share/zoneinfo/America/Lima /etc/localtime && \
echo "America/Lima" >  /etc/timezone
RUN mkdir -p /service && apk add --update nodejs npm
WORKDIR /service
COPY . /service
RUN npm install && npm run build
ENTRYPOINT ["sh", "-c", "NODE_ENV=${NODE_ENV} NODE_OPTIONS=--max_old_space_size=1024  npm run start:prod "]