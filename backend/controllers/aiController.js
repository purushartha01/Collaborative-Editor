import { autoCompleteFileContent, checkGrammarOfFile, enhanceTextOfFile, suggestionForFileContent, summarizeFileContent } from "../config/geminiConfig.js";


const grammarChecker = async (req, res, next) => {
    try {
        const { fileContent } = req.body;
        const result = await checkGrammarOfFile(fileContent);

        console.log("Grammar check result:", result);
        if (!result) {
            res.locals.statusCode = 500;
            throw new Error("No response from AI service");
        }

        res.status(200).json({ success: true, data: result.candidates[0] });
    } catch (err) {
        next(err);
    }
}

const textEnhancer = async (req, res, next) => {
    try {
        const { fileContent } = req.body;
        const result = await enhanceTextOfFile(fileContent);

        if (!result) {
            res.locals.statusCode = 500;
            throw new Error("No response from AI service");
        }

        res.status(200).json({ success: true, data: result.candidates[0] });
    } catch (err) {
        next(err);
    }
}

const summarizer = async (req, res, next) => {
    try {
        const { fileContent } = req.body;
        const result = await summarizeFileContent(fileContent);

        if (!result) {
            res.locals.statusCode = 500;
            throw new Error("No response from AI service");
        }

        res.status(200).json({ success: true, data: result.candidates[0] });
    } catch (err) {
        next(err);
    }
}

const suggestionProvider = async (req, res, next) => {
    try {
        const { fileContent } = req.body;
        const result = await suggestionForFileContent(fileContent);

        if (!result) {
            res.locals.statusCode = 500;
            throw new Error("No response from AI service");
        }

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

const autoCompleter = async (req, res, next) => {
    try {
        const { fileContent } = req.body;
        const chatHistory = [
            {
                role: "user",
                parts: [
                    { text: "Hello, I am writing a research article. Can you help complete the sentence?" }
                ]
            },
            {
                role: "model",
                parts: [
                    {
                        text: `{
        "task": "chat",
        "status": "success",
        "output": "Of course! I can help complete the sentence.",
        "notes": "I'm here to support your writing."
      }` }
                ]
            },
            {
                role: "user",
                parts: [
                    { text: "I want to maintain a formal academic tone. Keep that in mind." }
                ]
            },
            {
                role: "model",
                parts: [
                    {
                        text: `{
        "task": "chat",
        "status": "success",
        "output": "Understood. I will maintain a formal academic tone in all future responses.",
        "notes": "Tone preference stored."
      }` }
                ]
            }


        ];
        const result = await autoCompleteFileContent(fileContent, chatHistory);

        if (!result) {
            res.locals.statusCode = 500;
            throw new Error("No response from AI service");
        }

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

export { grammarChecker, textEnhancer, summarizer, suggestionProvider, autoCompleter }