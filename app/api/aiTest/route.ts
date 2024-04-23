//commented out for deployment

// import OpenAI from "openai";

// const openai = new OpenAI();

export async function POST(req: Request) {
  // const body = await req.json();
  // const prompt = body.prompt;
  // if (!prompt) {
  //   return Response.json({
  //     prompt,
  //   });
  // }
  // const completion = await openai.chat.completions.create({
  //   messages: [
  //     {
  //       role: "system",
  //       content: "You are a helpful assistant designed to output JSON.",
  //     },
  //     { role: "user", content: prompt },
  //   ],
  //   model: "gpt-3.5-turbo-1106",
  //   response_format: { type: "json_object" },
  // });
  // return Response.json({
  //   response: completion.choices[0].message.content,
  // });
}
