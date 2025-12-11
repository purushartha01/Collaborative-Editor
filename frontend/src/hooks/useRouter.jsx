import { createBrowserRouter } from 'react-router-dom';
import PageLayout from '../pages/PageLayout';
import AuthCallbackHandler from './../pages/AuthCallbackHandler';
import AuthError from '../pages/AuthError';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Settings from './../pages/Settings';
import Profile from './../pages/Profile';
import NotFound from './../pages/NotFound';
import ForgotPassword from './../pages/ForgotPassword';


const useRouter = () => {

    const { user } = useContext(AuthContext);

    const routes = [
        {
            path: "/auth/callback",
            element: <AuthCallbackHandler />
        },
        {
            path: "/auth/error",
            element: <AuthError />
        },
        {
            path: "/",
            element: <PageLayout />
        },
        {
            path: "/forgot-password",
            element: <ForgotPassword />
        },
        {
            path: "*",
            element: <NotFound />
        }
    ];

    const protectedRoutes = [
        {
            path: "/settings",
            element: <Settings />
        },
        {
            path: "/profile",
            element: <Profile />
        }
    ];

    const finalRoutes = [
        {
            path: "/",
            children: [...routes, ...(user ? protectedRoutes : [])]
        }
    ];

    return createBrowserRouter(finalRoutes);
}

export default useRouter;