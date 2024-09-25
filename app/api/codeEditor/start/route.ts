import prisma from "../../database/prismaConnection";

const Docker = require("dockerode");

const docker = new Docker();

export async function POST(req: Request) {
  const body = await req.json();
  const containerName = body.testID;

  const test = await prisma.testID.findUnique({
    where: {
      uid: containerName,
    },
  });

  if (!test) {
    return Response.json({
      message: "invalid",
    });
  }

  const containers = await docker.listContainers({ all: true });
  const container = containers.find((container: any) =>
    container.Names.includes(`/${containerName}`)
  );

  if (container) {
    console.log(`Container '${containerName}' already exists.`);
    const containerInfo = await docker.getContainer(container.Id).inspect();
    const portBindings = containerInfo.HostConfig.PortBindings;

    const ports = {
      webServer: portBindings["3000/tcp"][0].HostPort,
      socketServer: portBindings["9999/tcp"][0].HostPort,
    };
    console.log(ports);

    return new Response(JSON.stringify(ports));
  }

  const randomPort = Math.floor(Math.random() * 1000) + 3000;
  const randomPort2 = Math.floor(Math.random() * 1000) + 3000;

  docker.createContainer(
    {
      name: containerName,
      Image: "skillbit",
      ExposedPorts: {
        "9999/tcp": {},
        "3000/tcp": {},
      },
      HostConfig: {
        PortBindings: {
          "9999/tcp": [
            {
              HostPort: randomPort.toString(),
            },
          ],
          "3000/tcp": [
            {
              HostPort: randomPort2.toString(),
            },
          ],
        },
      },
    },
    (err: any, container: any) => {
      if (err) {
        console.log(err);
        return Response.json({
          message: "error",
        });
      } else {
        container.start().then(() => {
          console.log(container.id);
          return Response.json({
            message: "success",
          });
        });
      }
    }
  );
  const ports = {
    webServer: randomPort2,
    socketServer: randomPort,
  };

  return new Response(JSON.stringify(ports));
}
