import { GoogleGenAI } from "@google/genai";
import { Gemini_API_Key } from "./serverConfig.js";

const ai = new GoogleGenAI({
    apiKey: Gemini_API_Key,
});



// Completed: Works as expected
const checkGrammarOfFile = async (fileContent) => {

    const systemInstruction = `You are an AI Writing Assistant integrated into a collaborative text editor. Your role is to help  users improve their writing responsibly and contextually. You must act as a helpful, factual, concise, and ethical writing partner. The task to be performed & input will be passed on to you for each request. Follow these given response format strictly: {
    "task": "grammar-check",
    "status":"<success|failure>",
    "correctedText":"<the correct/improved version of input text>",
    "notes": "<any tips or suggestions to validate the corrections made>"
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: fileContent,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response;
}

// Completed: some improvements needed
const enhanceTextOfFile = async (fileContent) => {

    // TODO: Add whole document context in system instruction to ensure better enhancements & corrections. Also, change the prompt to reflect that taking into account the increase or reduction in text length.

    const systemInstruction = `You are an AI Writing Assistant integrated into a collaborative text editor. Your role is to help  users improve their writing responsibly and contextually. You must act as a helpful, factual, concise, and ethical writing partner. The task to be performed & input will be passed on to you for each request. Follow these given response format strictly: {
    "task": "text-enhancement",
    "status":"<success|failure>",
    "correctedText":"<the correct/improved version of input text sentence>",
    "notes": "<any tips or suggestions to validate the corrections made>"
    }`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: fileContent,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response;
}

// Completed: Works as expected
const summarizeFileContent = async (fileContent) => {
    const systemInstruction = `You are an AI Writing Assistant integrated into a collaborative text editor. Your role is to help  users improve their writing responsibly and contextually. You must act as a helpful, factual, concise, and ethical writing partner. The task to be performed & input will be passed on to you for each request. Follow these given response format strictly: {
    "task": "text-summarization",
    "status":"<success|failure>",
    "correctedText":"<the correct/improved version of input text>",
    "notes": "<any tips or suggestions to validate the corrections made>"
    }`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: fileContent,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response;
}

// Incomplete: Needs testing and possible improvements/fixes
const autoCompleteFileContent = async (fileContent, chatHistory) => {
    const systemInstruction = `You are an AI Writing Assistant integrated into a collaborative text editor. Your role is to help  users improve their writing responsibly and contextually. You must act as a helpful, factual, concise, and ethical writing partner. The task to be performed & input will be passed on to you for each request. Follow these given response format strictly: {
    "task": "sentence completion",
    "status":"<success|failure>",
    "correctedText":"<the correct/improved version of input text>",
    "notes": "<any tips or suggestions to validate the corrections made>"
    }`;

    const chat = ai.chats.create({
        model: "gemini-2.5-flash-lite",
        history: [...chatHistory],
        config: {
            systemInstruction: systemInstruction,
        }
    });

    const response = await chat.sendMessage({
        message: fileContent
    });

    return response;
}

// Incomplete: Needs testing and possible improvements/fixes
const suggestionForFileContent = async ({ context, prompt }) => {
    const systemInstruction = `You are an AI Writing Assistant integrated into a collaborative text editor. Your role is to provide contextually aware suggestions to the user. You must act as a helpful, factual, concise, and ethical writing partner. The task to be performed & input will be passed on to you for each request. Additionally, you will also be provided a short context to help you generate more relevant suggestions as well as the cursor position the user is currently at. Follow these given response format strictly: {
    "task": "suggestion-generation",
    "status":"<success|failure>",
    "suggestion":"<the suggestion based on the context and prompt>",
    "notes": "<any tips to validate the suggestions made>"
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: `${prompt}` + `\n\nContext:\n${context}`,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response;
}


export { checkGrammarOfFile, enhanceTextOfFile, suggestionForFileContent, summarizeFileContent, autoCompleteFileContent };