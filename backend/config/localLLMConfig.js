/*
The model used locally is: google/gemma-3-1b run via the LM Studio platform.
This file contains configuration specific to the local LLM setup.
 */

import { LMStudioClient } from "@lmstudio/sdk";

const client = new LMStudioClient();

const model = await client.llm.model("google/gemma-3-1b");

export const suggestionForFileContentLocally = async ({ context, prompt }) => {
    const systemInstruction = `You are an AI Writing Assistant integrated into a collaborative text editor. Your role is to help  users improve their writing responsibly and contextually. You must act as a helpful, factual, concise, and ethical writing partner. The task to be performed & input will be passed on to you for each request. Additionally, you will also be provided a short context to help you generate more relevant suggestions to complete the sentence as well as the cursor position the user is currently at. Follow these given response format strictly and in the suggestion field provide the exact suggestion that completes the provided context instead of advice to the user. The cursor position denotes the start of suggestion to generate , you have to complete the given context without altering the grammar or punctuation of context: {
    "task": "suggestion-generation",
    "status":"<success|failure>",
    "suggestion":"<the suggestion based on the context and prompt>",
    "notes": "<any tips to validate the suggestions made>"
    }`;
    const history = [
        {
            role: 'system',
            content: systemInstruction
        }, {
            role: 'user',
            content: `${prompt}` + `\n\nContext:\n${context}`
        }
    ]
    const response = await model.respond(history);
    return response;
};