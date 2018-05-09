FROM mhart/alpine-node:8

MAINTAINER Megan O'Keefe meokeefe@cisco.com

ADD . .

RUN apk update
RUN apk --no-cache add git

RUN chmod +x /start-ui.sh
RUN npm uninstall -g gulp && npm install -g gulp
RUN npm install
RUN npm rebuild node-sass --force

RUN apk del git

ENTRYPOINT ["/start-ui.sh"]
