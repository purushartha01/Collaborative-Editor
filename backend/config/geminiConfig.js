import { GoogleGenAI } from "@google/genai";
import { Gemini_API_Key } from "./serverConfig.js";

const ai = new GoogleGenAI({
    apiKey: Gemini_API_Key,
});


const checkGrammarOfFile = async (fileContent) => {
    const systemInstruction = `You are an AI Writing Assistant integrated into a collaborative text editor. Your role is to help  users improve their writing responsibly and contextually. You must act as a helpful, factual, concise, and ethical writing partner. The task to be performed & input will be passed on to you for each request. Follow these given response format strictly: {
    "task": "grammar-check",
    "status":"<success|failure>",
    "correctedText":"<the correct/improved version of input text>",
    "notes": "<any tips or suggestions to validate the corrections made>"
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        content: fileContent,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response;
}


const enhanceTextOfFile = async (fileContent) => {
    const systemInstruction = `You are an AI Writing Assistant integrated into a collaborative text editor. Your role is to help  users improve their writing responsibly and contextually. You must act as a helpful, factual, concise, and ethical writing partner. The task to be performed & input will be passed on to you for each request. Follow these given response format strictly: {
    "task": "text-enhancement",
    "status":"<success|failure>",
    "correctedText":"<the correct/improved version of input text>",
    "notes": "<any tips or suggestions to validate the corrections made>"
    }`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        content: fileContent,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response;
}

const summarizeFileContent = async (fileContent) => {
    const systemInstruction = `You are an AI Writing Assistant integrated into a collaborative text editor. Your role is to help  users improve their writing responsibly and contextually. You must act as a helpful, factual, concise, and ethical writing partner. The task to be performed & input will be passed on to you for each request. Follow these given response format strictly: {
    "task": "text-summarization",
    "status":"<success|failure>",
    "correctedText":"<the correct/improved version of input text>",
    "notes": "<any tips or suggestions to validate the corrections made>"
    }`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        content: fileContent,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response;
}


const autoCompleteFileContent = async (fileContent, chatHistory) => {
    const systemInstruction = `You are an AI Writing Assistant integrated into a collaborative text editor. Your role is to help  users improve their writing responsibly and contextually. You must act as a helpful, factual, concise, and ethical writing partner. The task to be performed & input will be passed on to you for each request. Follow these given response format strictly: {
    "task": "autocompletion",
    "status":"<success|failure>",
    "correctedText":"<the correct/improved version of input text>",
    "notes": "<any tips or suggestions to validate the corrections made>"
    }`;

    const chat = await ai.chats.create({
        model: "gemini-2.5-flash-lite",
        history: [...chatHistory]
    });

    const response = await chat.sendMessage({
        role: "user",
        content: fileContent
    });

    return response;
}

const suggestionForFileContent = async (prompt) => {
    const systemInstruction = `You are an AI Writing Assistant integrated into a collaborative text editor. Your role is to help  users improve their writing responsibly and contextually. You must act as a helpful, factual, concise, and ethical writing partner. The task to be performed & input will be passed on to you for each request. Follow these given response format strictly: {
    "task": "suggestion-generation",
    "status":"<success|failure>",
    "correctedText":"<the correct/improved version of input text>",
    "notes": "<any tips or suggestions to validate the corrections made>"
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        content: prompt,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response;
}


export { checkGrammarOfFile, enhanceTextOfFile, suggestionForFileContent, summarizeFileContent, autoCompleteFileContent };