import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import EditorRef from "./EditorRef";
import { fileStore } from "../stores/fileStore";



const Delta = Quill.import('delta');

const Editor = () => {

    const currentPage = fileStore((state) => state.currentPage);
    // const setPageDelta = fileStore((state) => state.updateFileDelta);
    // const addNewPage = fileStore((state) => state.addNewPage);
    // const pages = fileStore((state) => state.pages);

    // const pageData = pages.find(p => p.pageNumber === currentPage);

    // useEffect(() => {
    //     if (!quillRef.current) return;
    //     if (pageData?.delta) {
    //         quillRef.current.setContents(pageData.delta);
    //     } else {
    //         quillRef.current.setContents(new Delta());
    //     }

    // }, [currentPage, pageData]);


    const quillRef = useRef();
    const toolbarRef = useRef();

    return (
        <div className="w-full h-full overflow-y-auto flex justify-center py-4 relative">

            <div className="h-281.75 w-198.5 bg-orange-100 overflow-hidden text-black" id="editor">
                <div>
                    <EditorRef
                        ref={quillRef}
                        defaultValue={new Delta()}
                        toolbarRef={toolbarRef}
                        onTextChange={(delta, oldDelta, source) => {

                            const fullContent = quillRef.current.getContents();
                            // ensure file is saved first before updating delta
                            // fileStore.getState().updateFileDelta(currentPage, fullContent);
                            console.log("Content updated:", fullContent);
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