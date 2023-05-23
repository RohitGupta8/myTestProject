FROM infomakerscandinaviaab/nodebuild:14-alpine-with-chromium

WORKDIR /opt/app

COPY . /opt/app

RUN npm set progress=false && npm ci

ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "run", "integration-test" ]
