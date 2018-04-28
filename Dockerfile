FROM mhart/alpine-node:8

MAINTAINER Megan O'Keefe meokeefe@cisco.com

ADD . .

RUN chmod +x /start-ui.sh
RUN npm uninstall -g gulp && npm install -g gulp
RUN npm install
RUN npm rebuild node-sass --force

ENTRYPOINT ["/start-ui.sh"]
