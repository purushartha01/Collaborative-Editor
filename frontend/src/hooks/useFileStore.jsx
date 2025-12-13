import { openDB } from 'idb';
import { create } from 'zustand';

export const fileDB = await openDB("file-database", 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains("files")) {
            const fileStore = db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
            fileStore.createIndex("updatedAt", "updatedAt", { unique: false });
        }
    },

});

export const saveFileToDB = async (file) => {
    
    return await fileDB.put("files", {
        ...file,
        id,
        updatedAt: Date.now()
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

export const useFileStore = create((set, get) => ({
    fileId: null,
    fileTitle: "Untitled Document",
    pages: [{ pageNumber: 1, delta: null }],
    currentPage: 1,

    addNewFile: (title) => {
        const id = crypto.randomUUID();
        set({
            fileId: id,
            fileTitle: title || "Untitled Document",
            pages: [{ pageNumber: 1, delta: null }],
            currentPage: 1
        });
        saveFileToDB(get());
    },

    loadFile: async (id) => {
        const file = await getFileFromDB(id);
        if (!file) return;
        set({
            fileId: file.id,
            fileTitle: file.fileTitle,
            pages: file.pages,
            currentPage: 1
        });
    },

    updateFileDelta: (pageNumber, delta) => {
        const pages = get().pages.map((p) => p.pageNumber === pageNumber ? { ...p, delta } : p);
        set({ pages });
        saveFileToDB({
            id: get().fileId,
            fileTitle: get().fileTitle,
            pages
        });
    },

    addNewPage: () => {
        const pages = get().pages;
        const newPageNumber = pages.length + 1;
        const updatedPages = [...pages, { pageNumber: newPageNumber, delta: null }];
        set({ pages: updatedPages, currentPage: newPageNumber });
        saveFileToDB(get());
    }
}))