import { registerAINamespace } from "./ai.js";
import { registerDocumentNamespace } from "./documents.js";


export const registerAllNamespaces = (io) => {
    // Here you would import and register all your namespaces

    registerDocumentNamespace(io);
    registerAINamespace(io);
}