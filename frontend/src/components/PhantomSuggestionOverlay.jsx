
import { createPortal } from 'react-dom';

const PhantomSuggestionOverlay = ({ quill, suggestion }) => {

    if (!quill || !suggestion) return null;

    const bounds = quill.getBounds(suggestion?.cursorPosition);
    const [line, offsetInLine] = quill.getLine(suggestion?.cursorPosition);

    // console.log("PhantomSuggestionOverlay Rendered:", { bounds, line, offsetInLine, suggestion });

    const overlay =
        (
            <div
                style={{
                    position: "absolute",
                    top: bounds.top - 2,
                    minWidth: "100%",
                    textIndent: `calc(${bounds.left}px - 16px)`, // approx. character width
                    pointerEvents: "none",
                    paddingLeft: "15px",
                    paddingRight: "15px",

                    color: "gray",
                    fontStyle: "italic",

                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                }}
            >
                {suggestion.suggestion}
            </div>
        )
    return createPortal(overlay, quill.container);
}

export default PhantomSuggestionOverlay