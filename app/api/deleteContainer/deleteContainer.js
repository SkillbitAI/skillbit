const Docker = require("dockerode");

async function deleteContainer(backendKey, containerName) {
  let docker;
  try {
    docker = new Docker({
      host: "api.skillbit.org",
      protocol: "https",
      port: 444,
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

    if (container) {
      console.log(`Container '${containerName}' found. Removing...`);
      const existingContainer = docker.getContainer(container.Id);
      await existingContainer.remove({ force: true });
      console.log(`Container '${containerName}' removed.`);
      return { success: `Container '${containerName}' successfully deleted.` };
    } else {
      console.log(`Container '${containerName}' does not exist.`);
      return { error: `Container '${containerName}' not found.` };
    }
  } catch (err) {
    console.log("Error:", err);
    return {
      error: "An error occurred while deleting the container.",
      details: err,
    };
  }
}

export default deleteContainer;
