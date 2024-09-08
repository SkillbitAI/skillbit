import prisma from "../../database/prismaConnection";
import OpenAI from "openai";
import { z } from "zod";

const Docker = require("dockerode");
const docker = new Docker();

const openai = new OpenAI();

const FileSchema = z.object({
  filename: z.string(),
  content: z.string(),
  language: z.string(),
});

const FilesObject = z.object({
  files: z.array(FileSchema),
});

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

  // Generate files using OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4-0613", // Use an available model
    messages: [
      {
        role: "system",
        content:
          "Create a sample to-do list app in Next.js split over several files. For each file, include the filename, content, and programming language. Use '\\n' for newlines in the content.",
      },
      {
        role: "user",
        content:
          "Generate all necessary files for a basic to-do list app in Next.js. Include the language for each file.",
      },
    ],
    functions: [
      {
        name: "generate_files",
        description: "Generate files for a Next.js to-do list app",
        parameters: {
          type: "object",
          properties: {
            files: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  filename: { type: "string" },
                  content: { type: "string" },
                  language: { type: "string" },
                },
                required: ["filename", "content", "language"],
              },
            },
          },
          required: ["files"],
        },
      },
    ],
    function_call: { name: "generate_files" },
  });

  const functionCallArguments =
    completion.choices[0].message?.function_call?.arguments;
  const generatedFiles = functionCallArguments
    ? JSON.parse(functionCallArguments).files
    : [];

  // Process the generated files to replace '\n' with actual newlines
  const processedFiles = generatedFiles.map((file) => ({
    ...file,
    content: file.content.replace(/\\n/g, "\n"),
  }));

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

    return new Response(
      JSON.stringify({ ports, generatedFiles: processedFiles }, null, 2)
    );
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

  return new Response(
    JSON.stringify({ ports, generatedFiles: processedFiles }, null, 2)
  );
}
