const Docker = require("dockerode");

async function createContainer(backendKey, containerName) {
  let docker;
  try {
    docker = new Docker({
      host: "http://54.225.167.48",
      port: 2375,
    });
  } catch (err) {
    console.error("Error creating/starting container:", err);
    return {
      error: `Error creating/starting container: ${err.message}`,
    };
  }

  if (backendKey !== process.env.BACKEND_KEY) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const containers = await docker.listContainers({ all: true });
    const container = containers.find((container) =>
      container.Names.includes(`/${containerName}`)
    );

    // if (container) {
    //   console.log(`Container '${containerName}' already exists. Removing...`);
    //   const existingContainer = docker.getContainer(container.Id);
    //   await existingContainer.remove({ force: true });
    //   console.log(`Container '${containerName}' removed.`);
    // }

    if (container) {
      console.log(`Container '${containerName}' already exists.`);
      const containerInfo = await docker.getContainer(container.Id).inspect();
      const portBindings = containerInfo.HostConfig.PortBindings;

      const ports = {
        webServer: portBindings["3000/tcp"][0].HostPort,
        socketServer: portBindings["9999/tcp"][0].HostPort,
      };
      console.log(ports);

      return ports;
    }

    const randomPort = Math.floor(Math.random() * 1000) + 3000;
    const randomPort2 = Math.floor(Math.random() * 1000) + 3000;

    const newContainer = await docker.createContainer({
      name: containerName,
      Image: "code_runner",
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
    });

    await newContainer.start();
    console.log(newContainer.id);

    const ports = {
      webServer: randomPort2,
      socketServer: randomPort,
    };

    // console.log("PORTS:\n\n\n\n", JSON.stringify(ports))

    return ports;
  } catch (err) {
    console.log("Error:", err);
    return {
      error: "An error occurred while processing the request:",
      err,
    };
  }
}

export default createContainer;
