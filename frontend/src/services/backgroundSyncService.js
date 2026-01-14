import { fileStore, getFileFromDB } from "../stores/fileStore";
import instance from "./../config/axiosConfig";

let syncIntervalId = null;
let isSyncing = false;

const SYNC_INTERVAL = 60000; // 60 seconds 

export const startBackgroundSync = () => {
    if (syncIntervalId) {
        console.warn("Background sync is already running.");
        return;
    };

    syncIntervalId = setInterval(async () => {
        const { fileId, hasChanged, markUnchanged } = fileStore.getState();

        if (!fileId || !hasChanged) {
            return;
        }

        if (isSyncing) {
            return;
        }

        try {
            isSyncing = true;

            const latestFile = await getFileFromDB(fileId);

            if (!latestFile) {
                console.warn("File not found in DB during sync:", fileId);
                return;
            }

            console.log("Background syncing file to backend:", latestFile);

            await instance.put(`/documents/${fileId}`, {
                id: fileId,
                title: latestFile.fileTitle,
                pages: latestFile.pages
            });

            markUnchanged();
        } catch (err) {
            console.error("Error during background sync:", err);
        } finally {
            isSyncing = false;
        }
    }, SYNC_INTERVAL);
}

export const stopBackgroundSync = () => {
    if (!syncIntervalId) {
        return;
    }

    clearInterval(syncIntervalId);
    syncIntervalId = null;
}

export const flushSyncToBackend = async (origin = "unknown") => {
    const { fileId, hasChanged, markUnchanged } = fileStore.getState();

    if (!fileId || !hasChanged) {
        return;
    }

    if (isSyncing) {
        return;
    }

    try {
        isSyncing = true;

        const latestFile = await getFileFromDB(fileId);

        if (!latestFile) {
            console.warn("File not found in DB during flush sync:", fileId);
            return;
        }

        await instance.put(`/documents/${fileId}`, {
            content: latestFile.pages
        });

        markUnchanged();
        console.log(`Flush sync to backend successful (origin: ${origin})`);
    } catch (err) {
        console.error(`Error during flush sync to backend(origin: ${origin}):`, err);
    } finally {
        isSyncing = false;
    }
}