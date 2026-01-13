import { openDB } from 'idb';
import { create } from 'zustand';

export const fileDB = await openDB("file-database", 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains("files")) {
            const fileStore = db.createObjectStore("files", { keyPath: "fileId" });
            fileStore.createIndex("id_idx", "fileId", { unique: true });
            fileStore.createIndex("update_idx", "updatedAt", { unique: false });
        }
    },
});

export const saveFileToDB = async (file) => {

    console.log("Saving file to DB:", file);

    return await fileDB.put("files", {
        ...file,
        updatedAt: Date.now()
    });
}

export const saveBackendFileToDB = async (file) => {
    console.log("Saving backend file data to DB:", file);
    return await fileDB.put("files", {
        ...file
    });
}


export const getFileFromDB = async (id) => {
    return await fileDB.get("files", id);
}

export const getAllFilesFromDB = async () => {
    return await fileDB.getAll("files");
}


export const deleteFileFromDB = async (id) => {
    return await fileDB.delete("files", id);
}

const getValueFields = (obj) => {
    const { fileId, fileTitle, pages, currentPage } = obj;
    return { fileId, fileTitle, pages, currentPage };
}

export const fileStore = create((set, get) => ({
    fileId: null,
    fileTitle: "Untitled Document",
    pages: [{ pageNumber: 1, delta: null }],
    currentPage: 1,
    hasChanged: false,
    markChanged: () => {
        const { hasChanged } = get();
        if (!hasChanged) {
            set({ hasChanged: true });
        }
    },

    markUnchanged: () => {
        const { hasChanged } = get();
        if (hasChanged)
            set({ hasChanged: false });
    },

    addNewFile: async (title, id) => {
        try {
            // console.log("Adding new file with title and id:", title, id);
            set({
                fileId: id,
                fileTitle: title || "Untitled Document",
                pages: [{ pageNumber: 1, delta: null }],
                currentPage: 1
            });
            await saveFileToDB(getValueFields(get()));
            get().markChanged();
            // console.log("New file added to store and saved to DB:", get());
        } catch (err) {
            console.error("Error adding new file:", err);
        }
    },

    addExistingFile: async (file) => {
        try {
            set({
                fileId: file.fileId,
                fileTitle: file.fileTitle,
                pages: file.pages,
                currentPage: file.currentPage ?? 1
            });
            await saveBackendFileToDB(file);
        } catch (err) {
            console.error("Error setting and updating file:", err);
        }
    },

    loadFile: async (id) => {
        try {
            const file = await getFileFromDB(id);
            // console.log("File loaded from DB:", file);
            if (!file) return;
            set({
                fileId: file.fileId,
                fileTitle: file.fileTitle,
                pages: file.pages,
                currentPage: 1
            });

        } catch (err) {
            console.error("Error loading file from DB:", err);
        }
    },
    updateFileName: async (newTitle) => {
        try {
            const file = await getFileFromDB(get().fileId);
            if (!file) return;
            file.fileTitle = newTitle;
            set({ fileTitle: newTitle });
            await saveFileToDB(file);
            get().markChanged();
        } catch (err) {
            console.error("Error updating file name:", err);
        }
    }
    ,
    updateFileDelta: (pageNumber, delta) => {
        try {
            const pages = get().pages.map((p) => p.pageNumber === pageNumber ? { ...p, delta } : p);
            console.log("File delta updated for page", pages);
            set({ pages });

            return {
                fileId: get().fileId,
                fileTitle: get().fileTitle,
                pages: pages
            }

            // await saveFileToDB({
            //     fileId: get().fileId,
            //     fileTitle: get().fileTitle,
            //     pages
            // });
        } catch (err) {
            console.error("Error updating file delta:", err);
        }
    },

    addNewPage: async () => {
        try {
            const pages = get().pages;
            const newPageNumber = pages.length + 1;
            const updatedPages = [...pages, { pageNumber: newPageNumber, delta: null }];
            set({ pages: updatedPages, currentPage: newPageNumber });
            await saveFileToDB(getValueFields(get()));
            get().markChanged();
        } catch (err) {
            console.error("Error adding new page:", err);
        }
    }
}))