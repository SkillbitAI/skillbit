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

## Set up nginx

- install nginx: `sudo yum install nginx`
- `sudo nano /etc/nginx/conf.d/dynamic-ports.conf`
- start nginx: `sudo systemctl start nginx`
- paste this in the file:

```
server {
    listen 80;
    server_name api.skillbit.org 127.0.0.1;

    ## ODD PORTS – Socket endpoints
    #
    # Matches URLs like:
    #   /3001/socket.io/...
    # where 3001 is an odd-numbered port (4 digits, starting with 3).
    #
    location ~ "^/(?<port>3\d{2}[13579])/?(?<restOfPath>.*)$" {
        # Strip the port from the beginning of the URI.
        # For example: /3001/socket.io/  →  /socket.io/
        rewrite "^/(?<port>3\d{2}[13579])/?(.*)$" /$2 break;

        # For WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Forward the request to the backend on the given port.
        proxy_pass http://127.0.0.1:$port/$restOfPath$is_args$args;

        # Pass along common headers.
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    ## EVEN PORTS – React endpoints
    #
    # Two location blocks are used: one for requests with no extra path, and one
    # for requests with additional path info.

    # Case 1: Exactly /<port>/ (no additional path)
    location ~ "^/(?<port>3\d{2}[02468])/?$" {
        proxy_pass http://127.0.0.1:$port/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Case 2: /<port>/<restOfPath> (with extra path)
    location ~ "^/(?<port>3\d{2}[02468])/(?<restOfPath>.+)$" {
        # The backend expects the port number to be repeated as the first part
        # of the path. For example:
        #   Request: /3002/about → Proxy to: http://127.0.0.1:3002/3002/about
        proxy_pass http://127.0.0.1:$port/$port/$restOfPath$is_args$args;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    ## Catch-All: 404 if none of the above locations match.
    location / {
        return 404;
    }
}
```

- test: `sudo nginx -t`
- reload: `sudo systemctl reload nginx`

## Update DNS

- update to direct api.skillbit.org to the correct load balancer

## Update security groups

### Inbound

- All traffic to My IP
- All traffic to its own security group

### Outbound

- All traffic to My IP
- All traffic to its own security group
- HTTPS (port 443 will set automatically) to 0.0.0.0

## Other general commands

- Remove all docker containers (active and inactive): `docker rm -v -f $(docker ps -qa)`
- Remove only inactive docker containers: `docker rm -v $(docker ps --filter status=exited -q)`
- Show all containers: `docker ps -all`
- Restart docker: `sudo systemctl restart docker`
- Stop docker: `sudo systemctl stop docker`
- Start docker manually with desired hosts: `sudo dockerd -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock`

- Remember to set elastic IP address on EC2 instance
- Remember that you must start nginx whenever the instance shuts down and turns back on
