let debouncedTimer = null;
let currentRequestId = null;

export const initializeSuggestionListener = (aiSocket, handleSuggestion) => {
    aiSocket.on("ai-suggestion-response", (response) => {
        if (response.requestId !== currentRequestId) return;

        let data;
        try {

            const startingIndex = response.suggestion.indexOf('{');
            const endingIndex = response.suggestion.lastIndexOf('}') + 1;
            const jsonString = response.suggestion.substring(startingIndex, endingIndex);

            data = JSON.parse(jsonString);
            handleSuggestion({ ...data, cursorPosition: response.cursorPosition, pageNumber: response.pageNumber });
        } catch (err) {
            console.error("Error parsing AI Suggestion Response:", err);
            return;
        }
    });
}

export const removeSuggestionListener = (aiSocket) => {
    aiSocket.off("ai-suggestion-response");
}

export const requestAISuggestion = ({
    aiSocket,
    fileId,
    pageNumber,
    cursorPosition,
    contextText
}) => {
    if (debouncedTimer) {
        clearTimeout(debouncedTimer);
    }

    debouncedTimer = setTimeout(() => {
        // `currentRequestId` can be used to track the latest request
        const requestId = crypto.randomUUID();
        currentRequestId = requestId;

        aiSocket.emit("request-ai-suggestion", {
            requestId,
            fileId,
            pageNumber,
            cursorPosition,
            contextText
        });
    }, 300);
}
