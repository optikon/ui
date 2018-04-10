FROM mkenney/npm:7.0-alpine

MAINTAINER Megan O'Keefe meokeefe@cisco.com

RUN mkdir -p /ui
WORKDIR /ui

ADD . .

RUN npm install
RUN npm rebuild node-sass

EXPOSE 8000

CMD ["npm", "run", "start"]
