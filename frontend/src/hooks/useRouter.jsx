import { createBrowserRouter } from 'react-router-dom';
import PageLayout from '../pages/PageLayout';
import AuthCallbackHandler from './../pages/AuthCallbackHandler';
import AuthError from '../pages/AuthError';


const useRouter = () => {
    const routes = [
        {
            path: "/auth/callback",
            element: <AuthCallbackHandler />
        },
        {
            path: "/auth/error",
            element: <AuthError />
        }
    ];

    const protectedRoutes = [
        {
            path: "/",
            element: <PageLayout />
        },

    ];

    const finalRoutes = [
        {
            path: "/",
            children: [...routes, ...protectedRoutes]
        }
    ];

    return createBrowserRouter(finalRoutes);
}

export default useRouter;