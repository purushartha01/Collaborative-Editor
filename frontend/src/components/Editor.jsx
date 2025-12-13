import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import EditorRef from "./EditorRef";
import { useFileStore } from "../hooks/useFileStore";



const Delta = Quill.import('delta');

const Editor = () => {
    const [readOnly, setReadOnly] = useState(true);

    const currentPage = useFileStore((state) => state.currentPage);
    // const setPageDelta = useFileStore((state) => state.updateFileDelta);
    // const addNewPage = useFileStore((state) => state.addNewPage);
    // const pages = useFileStore((state) => state.pages);

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
                        readOnly={readOnly}
                        defaultValue={new Delta()}
                        toolbarRef={toolbarRef}
                        onTextChange={(delta, oldDelta, source) => {

                            const fullContent = quillRef.current.getContents();
                            // ensure file is saved first before updating delta
                            // useFileStore.getState().updateFileDelta(currentPage, fullContent);
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