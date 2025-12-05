
import { useEffect } from "react";
import { createPortal } from "react-dom";


const PortalContainer = ({ children, closePortal }) => {
    return (
        <div className="backdrop-blur-sm absolute top-0 left-0 w-full h-full flex justify-center items-center z-10">
            <div id="portal-container" className="absolute h-140 aspect-square bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[1px_1px_20px_rgba(0,0,0,0.1)] rounded-2xl backdrop-blur-2xl">
                <div className="relative h-full w-full px-4 flex flex-col py-4">
                    <button className="absolute z-50 top-0 right-2 w-10 aspect-square text-[2rem] text-black cursor-pointer" onClick={() => {
                        closePortal();
                    }}
                        data-type="portal-close-button"
                    >
                        &#10006;
                    </button>
                    {
                        children
                    }
                </div>
            </div>
        </div>
    )
}

const Portal = ({ children, closePortal }) => {

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('#portal-container') || event.target.dataset.type === "portal-close-button") {
                closePortal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closePortal]);

    return createPortal(<PortalContainer closePortal={closePortal}>{children}</PortalContainer>, document.body);
}


export default Portal;