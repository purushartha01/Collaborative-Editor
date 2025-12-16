import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import authStore from "../stores/authStore";

const AuthCallbackHandler = () => {

    const navigate = useNavigate();

    const assignAccessToken = authStore((s) => s.assignAccessToken);
    const assignUser = authStore((s) => s.assignUser);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const { accessToken } = JSON.parse(urlParams.get('token'));
        const user = JSON.parse(urlParams.get('user'));
        const redirectPath = urlParams.get('redirectTo');


        if (!!accessToken && !!user) {
            // 
            assignUser(user);
            assignAccessToken(accessToken);
            navigate(redirectPath, { replace: true });
        } else {
            navigate("/", { replace: true });
        }

    }, [navigate, assignAccessToken, assignUser]);

    return (
        <div className="h-full w-full grid place-items-center">
            Signing you in...
        </div>
    )
}

export default AuthCallbackHandler