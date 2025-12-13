import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import useAuthStore from "../hooks/useAuthStore";

const AuthCallbackHandler = () => {

    const navigate = useNavigate();

    const assignTokens = useAuthStore((s) => s.assignTokens);
    const assignUser = useAuthStore((s) => s.assignUser);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const { accessToken, refreshToken } = JSON.parse(urlParams.get('token'));
        const user = JSON.parse(urlParams.get('user'));
        const redirectPath = urlParams.get('redirectTo');


        if (!!accessToken && !!refreshToken && !!user) {
            // 
            assignUser(user);
            assignTokens(accessToken, refreshToken);
            navigate(redirectPath, { replace: true });
        } else {
            navigate("/", { replace: true });
        }

    }, [navigate, assignTokens, assignUser]);

    return (
        <div className="h-full w-full grid place-items-center">
            Signing you in...
        </div>
    )
}

export default AuthCallbackHandler