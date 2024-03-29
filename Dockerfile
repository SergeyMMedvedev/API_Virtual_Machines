FROM node:12
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser app

COPY apivirtualmachines/ .
RUN npm install
RUN chown -R app:app /opt/app
USER app
EXPOSE 3000
CMD [ "npm", "run", "pm2" ]