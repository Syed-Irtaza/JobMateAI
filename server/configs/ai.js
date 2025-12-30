import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.OPENI_API_KEY,
    baseURL:  process.env.OPENI_BASE_URL
});

export default ai