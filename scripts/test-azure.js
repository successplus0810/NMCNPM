import { AzureOpenAI } from "openai";

const endpoint = "https://conversation-openapi.openai.azure.com/";
const modelName = "gpt-35-turbo";
const deployment = "gpt-35-turbo";

export async function main() {

  const apiKey = "B03c0k9UdITLZN4QZjiSohFbixsxesykgrnEdDWIno1Zl3edvIMmJQQJ99BDACYeBjFXJ3w3AAABACOGnB4I";
  const apiVersion = "2024-04-01-preview";
  const options = { endpoint, apiKey, deployment, apiVersion }

  const client = new AzureOpenAI(options);

  const response = await client.chat.completions.create({
    messages: [
      { role:"system", content: "You are a helpful assistant." },
      { role:"user", content: "I am going to Paris, what should I see?" }
    ],
    max_tokens: 4096,
      temperature: 1,
      top_p: 1,
      model: modelName
  });

  if (response?.error !== undefined && response.status !== "200") {
    throw response.error;
  }
  console.log(response.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});