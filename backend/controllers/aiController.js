import { checkGrammarOfFile } from "../config/geminiConfig.js";


const grammarChecker = async (req, res, next) => {
    try {
        const { fileContent } = req.body;
        const result = await checkGrammarOfFile(fileContent);

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

const textEnhancer = async (req, res, next) => {
    try {
        const { fileContent } = req.body;
        const result = await enhanceTextOfFile(fileContent);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

const summarizer = async (req, res, next) => {
    try {
        const { fileContent } = req.body;
        const result = await summarizeFileContent(fileContent);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

const suggestionProvider = async (req, res, next) => {
    try {
        const { fileContent } = req.body;
        const result = await provideSuggestionsForFile(fileContent);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

const autoCompleter = async (req, res, next) => {
    try {
        const { fileContent } = req.body;
        const result = await autoCompleteFileContent(fileContent);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

export { grammarChecker, textEnhancer, summarizer, suggestionProvider, autoCompleter }