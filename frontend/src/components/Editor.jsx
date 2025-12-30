import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import EditorRef from "./EditorRef";
import { fileStore } from "../stores/fileStore";
import { useParams } from "react-router-dom";



const Delta = Quill.import('delta');

const Editor = () => {

    const [currentPageDelta, setCurrentPageDelta] = useState(null);

    const currentPage = fileStore((state) => state.currentPage);
    const updateFileDelta = fileStore((state) => state.updateFileDelta);

    const pages = fileStore((state) => state.pages);

    const currentPageData = pages.filter((page) => page.pageNumber === currentPage)[0];

    const loadFile = fileStore((state) => state.loadFile);
    // console.log("Editor rendered with currentPage:", currentPageData);

    const quillRef = useRef();
    const toolbarRef = useRef();

    const fileId = useParams().id;

    const preserveCursorIndex = (quill, newDelta) => {
        const currentSelection = quill.getSelection();
        quill.setContents(newDelta, 'silent');

        if (!currentSelection) return;

        const maxIndex = quill.getLength() - 1;
        const index = Math.min(currentSelection.index, maxIndex);

        quill.setSelection(index, currentSelection.length, 'silent');
    }


    useEffect(() => {
        const load = async () => {
            await loadFile(fileId);
        };
        load();
    }, [loadFile, fileId]);



    useEffect(() => {
        if (!quillRef.current) return;
        if (!currentPageData?.delta) return;

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
                            await updateFileDelta(currentPage, fullContent);
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