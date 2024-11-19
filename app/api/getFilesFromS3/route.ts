// Import necessary modules from AWS SDK
// @ts-nocheck
const { NextResponse } = require("next/server");
const {
  S3Client,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Initialize an S3 client with provided credentials
const s3Client = new S3Client({
  region: process.env.S3_REGION, // Specify the AWS region from environment variables
  credentials: {
    accessKeyId: process.env.S3_ACCESSKEYID, // Access key ID from environment variables
    secretAccessKey: process.env.S3_SECRETACCESSKEY, // Secret access key from environment variables
  },
});

export async function POST(req) {
  try {
    // Parse request body
    const { testId, recruiter } = await req.json();

    if (!testId) {
      return NextResponse.json(
        { error: "Invalid input. Provide a 'testId'." },
        { status: 400 }
      );
    }

    // List all objects under the folder (testId)
    const listParams = {
      Bucket: "skillbit-inprogress",
      Prefix: `${testId}/`, // Fetch all files under this folder
    };

    const listCommand = new ListObjectsV2Command(listParams);
    const listResponse = await s3Client.send(listCommand);

    if (
      !recruiter &&
      (!listResponse.Contents || listResponse.Contents.length === 0)
    ) {
      const file = {
        filename: "generated-files.js",
        content: "This would be when we load in the generated files to S3",
      };

      if (!file.filename || !file.content) {
        throw new Error("Each file must have a 'filename' and 'content'.");
      }

      const params = {
        Bucket: "skillbit-inprogress",
        Key: `${testId}/${file.filename}`, // Save under the folder with the testId
        Body: file.content,
        ContentType: "text/plain", // Adjust content type based on your file type
      };

      await s3Client.send(new PutObjectCommand(params));
    }

    if (
      recruiter &&
      (!listResponse.Contents || listResponse.Contents.length === 0)
    ) {
      return NextResponse.json({ message: "No files found in the folder." });
    }

    const filesWithContent = await Promise.all(
      listResponse.Contents.map(async (file) => {
        const getCommand = new GetObjectCommand({
          Bucket: "skillbit-inprogress",
          Key: file.Key,
        });

        const response = await s3Client.send(getCommand);
        const content = await streamToString(response.Body);

        return { fileName: file.Key, content };
      })
    );

    return NextResponse.json({ files: filesWithContent });
  } catch (error) {
    console.error("Error retrieving file:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to convert stream to string
async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}
