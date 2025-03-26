import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../database/prismaConnection";

// Import necessary modules from AWS SDK
// @ts-nocheck
const { NextResponse } = require("next/server");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_ACCESSKEY || "");

export async function POST(req: Request) {
  try {
    // Parse request body
    console.log("grading insights:");
    const { files, instructions, testId } = await req.json();
    console.log("THESE ARE THE FILES: ", files, instructions, testId);

    if (!testId || !instructions || !files) {
      return NextResponse.json(
        { error: "Invalid input. Provide all parameters." },
        { status: 400 }
      );
    }

    const userPrompt = await getPrompt(files, instructions);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await generateInstructionsFromPrompt(
      model,
      userPrompt || ""
    );

    console.log("RESPONSE:", response);

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Error retrieving file:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function generateInstructionsFromPrompt(
  model: any,
  prompt: string
): Promise<string> {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response.text();
    console.log("Raw instructions:", response);

    // Clean the response to ensure valid JSON (if applicable)
    const cleanedResponse = response.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(cleanedResponse);
      if (parsed.instructions) {
        return parsed.instructions.replace(/\\n/g, "\n"); // Handle escaped newlines
      }
    } catch (jsonError) {
      console.warn("Response was not JSON, returning raw text.");
    }

    // If not JSON, assume the response is the instruction text
    return cleanedResponse;
  } catch (error: any) {
    console.error("Failed to generate instructions:", error);
    throw new Error("Failed to generate instructions from the prompt.");
  }
}

async function getPrompt(files: any, instructions: string) {
  try {
    const rubric = `
Correctness (0–5 points)
This category evaluates if the code solves the problem as described in the prompt.

5 points: Code solves the problem correctly and passes all edge cases or test cases.
4 points: Code solves the problem with minor issues (like missing edge cases or handling certain input types incorrectly).
3 points: Code partially solves the problem but has notable bugs or is inefficient in certain cases.
2 points: Code produces the wrong result most of the time or only solves a part of the problem.
1 point: Code does not solve the problem, but there is an attempt to use the right approach.
0 points: No code or completely irrelevant code.

Efficiency (0–5 points)
This evaluates whether the solution is efficient in terms of time and space complexity, particularly for larger inputs.

5 points: The solution is optimal for the given problem, with an appropriate time complexity (e.g., O(n), O(log n)).
4 points: The solution is efficient but could be optimized further in terms of time or space complexity.
3 points: The solution works but is inefficient or unnecessarily complex.
2 points: The solution is inefficient, likely resulting in high time complexity or unnecessary resource usage.
1 point: The solution works but is extremely slow or uses excessive memory, and optimization would be required for larger input sizes.
0 points: The solution does not solve the problem at all.

Code Style (0–5 points)
This evaluates the clarity of the code in terms of readability, organization, and structure.

5 points: Code is well-organized, easy to read, follows standard coding conventions, and has appropriate comments.
4 points: Code is mostly clean, with minor issues in readability or missing comments, but still understandable.
3 points: Code is somewhat disorganized, with issues in readability or lack of comments in complex sections.
2 points: Code is hard to follow due to lack of structure, poor naming conventions, or missing comments.
1 point: Code is difficult to read and understand, with very poor structure or no comments.
0 points: Code is incomprehensible or unreadable.

Problem Solving / Approach (0–5 points)
This evaluates the logic and approach used to solve the problem.

5 points: Solution demonstrates a deep understanding of algorithms or techniques, and the approach is highly effective and clean.
4 points: The approach is sound but could be simplified or made more efficient.
3 points: The solution works, but the approach is either overcomplicated or not optimal.
2 points: The approach used to solve the problem is flawed or inefficient, but there’s an attempt at a solution.
1 point: The approach does not work, or there is a major flaw in the solution.
0 points: No attempt or the solution approach is completely incorrect.

Edge Case Handling (0–5 points)
This checks whether the code considers edge cases or special scenarios mentioned in the prompt or that are commonly expected in such problems (e.g., empty input, large inputs, etc.).

5 points: Code handles all edge cases and unexpected input types gracefully.
4 points: Code handles most edge cases, with only one or two missing.
3 points: Code handles basic cases but fails on some edge cases (e.g., empty input, very large numbers, etc.).
2 points: Code fails on most edge cases.
1 point: Code does not handle any edge cases.
0 points: Code does not handle any cases.

Clarity (0–5 points)
This evaluates how well the user’s explanation (if provided) or the code itself is organized and explained. This can also be an assessment of whether the user’s approach to explaining the code makes it understandable.

5 points: Clear and concise explanation of the code with excellent documentation and comments.
4 points: The explanation is mostly clear but could benefit from more detail or a few additional comments.
3 points: The explanation is somewhat helpful, but lacks clarity or misses some key points.
2 points: The explanation is vague and doesn't provide enough insight into the code or approach.
1 point: There is no explanation or the explanation is inadequate to understand the code.
0 points: No explanation provided, and the code is completely unexplainable.

Give the final score out of 30 points and explain where the user lost points.
`;
    const schema = {
      type: "object",
      properties: {
        response: {
          type: "array",
          items: {
            type: "object",
            properties: {
              correctness: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    score: {
                      type: "integer",
                      description:
                        "The total score of the correctness section out of 5.",
                    },
                    explanation: {
                      type: "string",
                      description:
                        "Explain where the user lost points in the correctness section (if any) and why.",
                    },
                  },
                  required: ["score", "explanation"],
                },
              },

              efficiency: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    score: {
                      type: "integer",
                      description:
                        "The total score of the efficiency section out of 5.",
                    },
                    explanation: {
                      type: "string",
                      description:
                        "Explain where the user lost points in the efficiency section (if any) and why.",
                    },
                  },
                  required: ["score", "explanation"],
                },
              },

              codestyle: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    score: {
                      type: "integer",
                      description:
                        "The total score of the code style section out of 5.",
                    },
                    explanation: {
                      type: "string",
                      description:
                        "Explain where the user lost points in the code style section (if any) and why.",
                    },
                  },
                  required: ["score", "explanation"],
                },
              },

              problemsolvingapproach: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    score: {
                      type: "integer",
                      description:
                        "The total score of the Problem Solving / Approach section out of 5.",
                    },
                    explanation: {
                      type: "string",
                      description:
                        "Explain where the user lost points in the Problem Solving / Approach section (if any) and why.",
                    },
                  },
                  required: ["score", "explanation"],
                },
              },

              edgecasehandling: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    score: {
                      type: "integer",
                      description:
                        "The total score of the Edge Case Handling section out of 5.",
                    },
                    explanation: {
                      type: "string",
                      description:
                        "Explain where the user lost points in the Edge Case Handling section (if any) and why.",
                    },
                  },
                  required: ["score", "explanation"],
                },
              },

              clarity: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    score: {
                      type: "integer",
                      description:
                        "The total score of the clarity section out of 5.",
                    },
                    explanation: {
                      type: "string",
                      description:
                        "Explain where the user lost points in the clarity section (if any) and why.",
                    },
                  },
                  required: ["score", "explanation"],
                },
              },

              total_score: {
                type: "integer",
                description:
                  "The total score of the user's submission out of 30 points.",
              },
            },
            required: [
              "correctness",
              "efficiency",
              "codestyle",
              "problemsolvingapproach",
              "edgecasehandling",
              "clarity",
              "total_score",
            ],
          },
        },
      },
      required: ["response"],
    };

    const finalPrompt = `
    You are going to be grading a job applicant's response to this technical interview question: ${instructions}.
    ----
    Here is the grading rubric you must use: ${rubric}.
    ----
    Here are the files that the user submitted as their attempt to solve the question: ${files}.
    ----
    The response should be valid JSON matching this schema:
    
    ${JSON.stringify(schema, null, 2)}
    
    Make sure to escape newlines with \\n in the content.
    `;

    return finalPrompt;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getPromptInstructions(id: string) {
  try {
    const prompt = await prisma.testID.findUnique({
      where: {
        id: id,
      },
      select: {
        template: {
          select: {
            prompt: true,
          },
        },
      },
    });
    const userPart = prompt?.template?.prompt;

    return userPart;
  } catch (error) {
    console.error(error);
    return null;
  }
}
