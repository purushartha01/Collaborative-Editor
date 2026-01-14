export const registerDocumentNamespace = (io) => {
    const documentNamespace = io.of("/documents");

    documentNamespace.on("connection", (socket) => {

        console.log("A user connected to the Documents namespace:", socket.id);

        socket.on("join-document", ({ fileId, userId }) => {
            socket.join(`document:${fileId}`);
        });

        socket.on("leave-document", ({ fileId, userId }) => {
            socket.leave(`document:${fileId}`);
        });

        socket.on("disconnect", () => {
            // Handle any cleanup if necessary
        });
    });
}