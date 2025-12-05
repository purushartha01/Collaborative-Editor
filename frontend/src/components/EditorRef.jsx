import { forwardRef, useEffect, useLayoutEffect, useRef } from "react"
import 'quill/dist/quill.snow.css';
import Quill from 'quill';


const EditorRef = forwardRef(
    ({ readOnly, defaultValue, toolbarRef, onTextChange, onSelectionChange }, ref) => {

        const containerRef = useRef(null);
        const defaultValueRef = useRef(defaultValue);
        const onTextChangeRef = useRef(onTextChange);
        const onSelectionChangeRef = useRef(onSelectionChange);


        useLayoutEffect(() => {
            onTextChangeRef.current = onTextChange;
            onSelectionChangeRef.current = onSelectionChange;
        });

        useEffect(() => {
            ref.current?.enable(!readOnly);
        }, [ref, readOnly]);

        useEffect(() => {
            const container = containerRef.current;
            const EditorContainer = container.appendChild(
                container.ownerDocument.createElement("div")
            );

            const Header = Quill.import('formats/header');
            Quill.register(Header, true);


            const quill = new Quill(EditorContainer, {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],
                        ['link', 'image', 'video', 'formula'],
                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                        [{ 'direction': 'rtl' }],                         // text direction
                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                        ['clean']                                         // remove formatting button
                    ]
                }
            });

            ref.current = quill;

            if (defaultValueRef.current) {
                quill.setContents(defaultValueRef.current);
            }

            quill.on(Quill.events.TEXT_CHANGE, (...args) => {
                onTextChangeRef.current?.(...args);
            });

            quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
                onSelectionChangeRef.current?.(...args);
            });

            return () => {
                ref.current = null;
                container.innerHTML = "";
            }

        }, [ref, toolbarRef]);

        /*
        Page Dimensions: 70.1875rem height, 49.625rem width
        */

        return <div ref={containerRef} className="h-280.75 w-198.5" />;
    }
);

EditorRef.displayName = "EditorRef";

export default EditorRef