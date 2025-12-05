import Quill from "quill";
import { useRef, useState } from "react";
import EditorRef from "./EditorRef";



const Delta = Quill.import('delta');

const Editor = () => {
    const [lastChange, setLastChange] = useState();
    const [readOnly, setReadOnly] = useState(false);


    const quillRef = useRef();
    const toolbarRef = useRef();

    return (
        <div className="w-full h-full overflow-y-auto flex justify-center py-4 relative">

            <div className="h-281.75 w-198.5 bg-orange-100 overflow-hidden text-black"  id="editor">
                <div>
                    <EditorRef
                        ref={quillRef}
                        readOnly={readOnly}
                        defaultValue={new Delta()}
                        toolbarRef={toolbarRef}
                        onTextChange={(delta, oldDelta, source) => {

                            console.log("Text change:", { delta, oldDelta, source });
                            setLastChange({ delta, oldDelta, source });
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