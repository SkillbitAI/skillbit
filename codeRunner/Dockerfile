FROM ubuntu:latest
WORKDIR /server
EXPOSE 9999
EXPOSE 3000
RUN apt update && apt upgrade -y
ARG NODE_MAJOR=18
RUN apt-get install -y ca-certificates curl gnupg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" > /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && \
    apt-get install -y nodejs
RUN apt-get install -y build-essential
COPY package.json .
RUN npm install
COPY . .
RUN npm rebuild node-pty
WORKDIR /home
RUN npm config set legacy-peer-deps true
RUN npx create-react-app project
WORKDIR /home/project
COPY codeRunner.env .env
WORKDIR /server
RUN npm install -g pm2
CMD pm2 start server.js && cd /home/project && npm start && pm2 logs