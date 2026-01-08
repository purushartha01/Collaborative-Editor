

let timeoutId = null;

const scheduleAutoSave = (saveFunction, delay = 3000) => {
    console.log("Scheduling auto-save...");
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        saveFunction();
    }, delay);
}


const flushAutoSave = async (saveFunction) => {
    clearTimeout(timeoutId);
    await saveFunction();
}

export { scheduleAutoSave, flushAutoSave };