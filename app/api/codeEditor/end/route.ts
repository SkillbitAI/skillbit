import deleteContainer from "../../deleteContainer/deleteContainer";
import prisma from "../../database/prismaConnection";
const Docker = require("dockerode");
const docker = new Docker();

const DOCKER_EC2_TOGGLE = true;

export async function POST(req: Request) {
  console.log("EC2");
  const body = await req.json();
  const containerName = body.testID;

  let ports;

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

  try {
    const response = await deleteContainer(
      process.env.BACKEND_KEY,
      containerName
    );

    ports = response;
  } catch (error) {
    console.error("Error getting response from Lambda:", error);
    return Response.json(
      {
        message: "Error getting response from Lambda",
      },
      { status: 400 }
    );
  }

  console.log("ports:", JSON.stringify(ports));

  return new Response(JSON.stringify(ports));
}
