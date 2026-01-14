import { suggestionForFileContent } from "../../config/geminiConfig.js";


export const registerAINamespace = (io) => {
    const aiNamespace = io.of("/ai");

    aiNamespace.on("connection", (socket) => {
        console.log("A user connected to the AI namespace:", socket.id);

        // TODO: implement storage and retrieval of AI session data via db or redis

        socket.on("join-ai-room", ({ fileId, userId }) => {
            console.log(`User ${userId} joining AI room for file ${fileId}`);
            socket.join(`ai-session:${fileId}`);
        });

        socket.on("leave-ai-room", ({ fileId, userId }) => {
            console.log(`User ${userId} leaving AI room for file ${fileId}`);
            socket.leave(`ai-session:${fileId}`);
        });

        socket.on("request-ai-suggestion", async (data) => {
            // Handle AI assistance request
            // For example, process the data and send back a response

            console.log("Received AI suggestion request:", data);

            // const response = await suggestionForFileContent({ context: data.contextText, prompt: `Generate a relevant suggestion based on the provided context with cursor at position ${data.cursorPosition}.` });

            const response = {};

            socket.emit("ai-suggestion-response", {
                requestId: data.requestId,
                suggestion: Object.keys(response).length > 0 ? response.candidates[0].content.parts[0].text : JSON.stringify({ "task": "suggestion-generation", "status": "success", "suggestion": "attention and playtime.", "notes": "The sentence discusses husky characteristics and their communication methods. Adding that they like attention and playtime flows naturally from the previous sentence about their playful nature." }),
                cursorPosition: data.cursorPosition, pageNumber: data.pageNumber
            });
        });
    });
}