import { useEffect } from "react";
import authStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";


const NotFound = () => {
    const user = authStore((state) => state.user);

    const navigate=useNavigate();

    useEffect(() => {
        console.error("Checking user authentication in EditorContainer", user);
        if (!user) {
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            hashParams.set("openPortal", "login");
            navigate(`/#${hashParams.toString()}`);
            return;
        }
    }, [user, navigate]);
    return (
        <div className="h-full w-full place-items-center">NotFound</div>
    )
}

export default NotFound