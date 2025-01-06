## Getting Started

First, install Docker on your computer and open it. Then run:

```bash
npm i
cd codeRunner
docker build -t skillbit .
cd ..
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

# Docker

## Install docker

- Update the packages on your instance: `sudo yum update -y`
- Install Docker: `sudo yum install docker -y`
- Start the Docker Service: `sudo service docker start`
- Add the ec2-user to the docker group so you can execute Docker commands without using sudo: `sudo usermod -a -G docker ec2-user`

## Upload files

- `cd ~`
- `mkdir code_runner`
- `cd code_runner`
- `nano Dockerfile` and paste contents
- `nano package.json` and paste contents
- `nano codeRunner.env` and paste contents
- `nano server.js` and paste contents
- `cd ~`

## build image

- `cd ~`
- `sudo docker build -t code_runner ./code_runner`

## Edit docker service unit file

- Edit the Docker service unit file: `sudo systemctl edit docker`

Make sure the lines exist and/or read:

```
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock
```

- Reload the daemon: `sudo systemctl daemon-reload`
- Restart docker: `sudo systemctl restart docker`

## Other general commands

- Remove all docker containers (active and inactive): `docker rm -v -f $(docker ps -qa)`
- Remove only inactive docker containers: `docker rm -v $(docker ps --filter status=exited -q)`
- Restart docker: `sudo systemctl restart docker`
- Stop docker: `sudo systemctl stop docker`
- Start docker manually with desired hosts: `sudo dockerd -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock`
