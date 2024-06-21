import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI, ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { swapIntents } from "./sampleData";
import { extractArrayFromContent, findTransactions } from "./helpers";

// Function to query transaction database
const queryTransactionData = (type: string) => {
  if (type === "history") {
    return swapIntents.filter((intent) => intent.status !== "Open");
  } else if (type === "open") {
    return swapIntents.filter((intent) => intent.status === "Open");
  }
  return [];
};

// Function to get the full chain
export const getFullChain = (model: ChatOpenAI<ChatOpenAICallOptions>) => {
  //////////////////////////////////////////////////
  // Define the prompt templates for each category
  //////////////////////////////////////////////////
  const transactionContextChain = PromptTemplate.fromTemplate(
    `You are an expert in providing information on active, filled or closed transactions, swaps, and trade intents on StarkLens.
Please respond in short sentences. If match is found, provide only the IDs of relevant trades for the following query:

Context: {context}
Question: {question}
Answer (return a list of the IDs at the end of your sentence in the format [id1, id2, id3]):`
  ).pipe(model);

  const priceChain = PromptTemplate.fromTemplate(
    `You are an expert in providing current price information of tokens. Short and precise sentences.
Please provide the price information for the following query:

Question: {question}
Answer:`
  ).pipe(model);

  const generalChain = PromptTemplate.fromTemplate(
    `Use short sentences. Respond to the following question:

Question: {question}
Answer:`
  ).pipe(model);

  //////////////////////////////////////////////////
  // Define the classification prompt and chain
  //////////////////////////////////////////////////
  const classificationPromptTemplate = PromptTemplate.fromTemplate(`
Given the user question below, classify it as either being about \`transaction\`, \`price\`, or \`null\`.

Do not respond with more than one word.

<question>
{question}
</question>

Classification:`);

  const classificationChain = RunnableSequence.from([
    classificationPromptTemplate,
    model,
    new StringOutputParser(),
  ]);

  //////////////////////////////////////////////////
  // Define the routing function
  //////////////////////////////////////////////////
  const route = async ({
    topic,
    question,
  }: {
    topic: string;
    question: string;
  }) => {
    console.log("my topic is", topic);
    if (topic.toLowerCase().includes("transaction")) {
      const transactionTypePrompt = PromptTemplate.fromTemplate(`
  Given the user question below, classify it as either being about \`history\` or \`open\`.
  
  Do not respond with more than one word.
  
  <question>
  {question}
  </question>
  
  Classification:`);

      const transactionTypeChain = RunnableSequence.from([
        transactionTypePrompt,
        model,
        new StringOutputParser(),
      ]);

      const transactionType = await transactionTypeChain.invoke({ question });

      const transactionData = queryTransactionData(transactionType.trim());
      // Get the top 3 transactions
      const context = JSON.stringify(transactionData.slice(0, 3));
      return transactionContextChain.invoke({ context, question });
    } else if (topic.toLowerCase().includes("price")) {
      return priceChain;
    } else {
      return generalChain;
    }
  };

  //////////////////////////////////////////////////
  // Define the full chain
  //////////////////////////////////////////////////
  const fullChain = RunnableSequence.from([
    {
      topic: async (input) => {
        const classificationResult = await classificationChain.invoke({
          question: input.question,
        });
        return classificationResult.trim();
      },
      question: (input) => input.question,
    },
    route,
  ]);

  return fullChain;
};

export async function callVectorDBQAChain(
  query: string,
  index: any,
  appId: number,
  agent: string,
  messages: any[] | any
) {
  const requestBody = {
    query: query,
    index: index,
    messages: messages,
    agent: agent,
    appId: appId,
  };

  try {
    const url =
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/vector-search` as string;
    const vectorSearchResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!vectorSearchResponse.ok) {
      throw new Error("Failed to fetch from vector-search");
    }

    const result = await vectorSearchResponse.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

export function formatAIResponse(content: any) {
  const { textWithoutArray, array } = extractArrayFromContent(content);
  const transactions = findTransactions(array, swapIntents);
  return {
    text: textWithoutArray,
    attachments: transactions,
  };
}
