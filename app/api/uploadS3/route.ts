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
    const { testId, files } = await req.json();

    if (!testId || !files || !Array.isArray(files)) {
      return NextResponse.json(
        {
          error:
            "Invalid input. Please provide a testId and an array of files.",
        },
        { status: 400 }
      );
    }

    // Save each file to S3
    const uploadPromises = files.map((file) => {
      if (!file.filename || !file.content) {
        throw new Error("Each file must have a 'filename' and 'content'.");
      }

      // Determine if it's a Python file
      const isPythonFile = file.filename.toLowerCase().endsWith(".py");

      const params = {
        Bucket: "skillbit-inprogress",
        // For Python files, save directly in the test directory, for JS files use project/src
        Key: `${testId}/${isPythonFile ? "" : "project/src/"}${file.filename}`,
        Body: file.content,
        ContentType: "text/plain", // Adjust content type based on your file type
      };

      return s3Client.send(new PutObjectCommand(params));
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    return NextResponse.json({ message: "Files uploaded successfully." });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
