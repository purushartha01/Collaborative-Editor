import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import EditorRef from "./EditorRef";
import { fileStore, saveFileToDB } from "../stores/fileStore";
// import { useParams } from "react-router-dom";
import { scheduleAutoSave } from "../controllers/autoSaveControllers";



const Delta = Quill.import('delta');

const Editor = () => {

    const [currentPageDelta, setCurrentPageDelta] = useState(null);

    const currentPage = fileStore((state) => state.currentPage);
    const updateFileDelta = fileStore((state) => state.updateFileDelta);

    const pages = fileStore((state) => state.pages);

    const currentPageData = pages.filter((page) => page.pageNumber === currentPage)[0];
    const hasChanged = fileStore((state) => state.hasChanged);

    // const loadFile = fileStore((state) => state.loadFile);

    const quillRef = useRef();
    const toolbarRef = useRef();

    // const fileId = useParams().id;

    const preserveCursorIndex = (quill, newDelta) => {
        const currentSelection = quill.getSelection();
        if (newDelta === null) {
            newDelta = new Delta();
        }

        quill.setContents(newDelta, 'silent');

        if (!currentSelection) return;

        const maxIndex = quill.getLength() - 1;
        const index = Math.min(currentSelection.index, maxIndex);

        quill.setSelection(index, currentSelection.length, 'silent');
    }


    // useEffect(() => {
    //     const load = async () => {
    //         await loadFile(fileId);
    //     };
    //     load();
    // }, [loadFile, fileId]);


    useEffect(() => {
        const unexpectedShutdownHandler = async () => {
            if (!quillRef.current) return;
            // if (!hasChanged) return;

            const contents = quillRef.current.getContents();
            const snapshot = updateFileDelta(fileStore.getState().currentPage, contents);
            await saveFileToDB(snapshot);
        }

        window.addEventListener('beforeunload', unexpectedShutdownHandler);
        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === 'hidden') {
                await unexpectedShutdownHandler();
            }
        });

        return () => {
            window.removeEventListener('beforeunload', unexpectedShutdownHandler);
        }

    }, [updateFileDelta, hasChanged]);


    useEffect(() => {
        if (!quillRef.current) return;

        // This check is commented out to ensure delta is always applied even if it is null in case of a new page/document
        // if (!currentPageData?.delta) return;

        const quill = quillRef.current;

        preserveCursorIndex(quill, currentPageData.delta);

    }, [currentPageData.delta, currentPage]);

    return (
        <div className="w-full h-full overflow-y-auto flex justify-center py-4 relative">
            <div className="h-281.75 w-198.5 bg-orange-100 overflow-hidden text-black" id="editor">
                <div>
                    <EditorRef
                        ref={quillRef}
                        toolbarRef={toolbarRef}
                        onTextChange={async (delta, oldDelta, source) => {
                            if (source !== 'user') return;

                            const fullContent = quillRef.current.getContents();

                            updateFileDelta(currentPage, fullContent);



                            scheduleAutoSave(async () => {
                                const state = fileStore.getState();
                                const snapshot = {
                                    fileId: state.fileId,
                                    fileTitle: state.fileTitle,
                                    pages: state.pages,
                                    currentPage: state.currentPage
                                };
                                await saveFileToDB(snapshot);
                                state.markChanged();
                            });
                        }}
                        onSelectionChange={(range, oldRange, source) => {
                            // Handle selection change if needed
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Editor