import { ChatOpenAI } from "@langchain/openai";
import { formatAIResponse, getFullChain } from "@/utils";

export default async function handler(req: any, res: any) {
  const { prompt } = req.body;

  try {
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      openAIApiKey: process.env.OPENAI_API_KEY as string,
    });

    const fullChain = getFullChain(model);

    const result: any = await fullChain.invoke({
      question: prompt,
    });

    const data = await result;
    const content = await data.content;
    console.log("pre formatted content", content);
    const response = formatAIResponse(content);

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e ?? "Error classifying prompt" });
  }
}
