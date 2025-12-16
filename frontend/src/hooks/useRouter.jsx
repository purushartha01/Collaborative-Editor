import { createBrowserRouter } from 'react-router-dom';
import PageLayout from '../pages/PageLayout';
import AuthCallbackHandler from './../pages/AuthCallbackHandler';
import AuthError from '../pages/AuthError';
import { useContext } from 'react';
import Settings from './../pages/Settings';
import Profile from './../pages/Profile';
import NotFound from './../pages/NotFound';
import ForgotPassword from './../pages/ForgotPassword';
import authStore from './../stores/authStore';
import EditorContainer from '../components/EditorContainer';


const useRouter = () => {

    const user = authStore((s) => s.user);

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
            element: <PageLayout />,
            children: user ? [{
                path: "/document/:id",
                element: <EditorContainer />
            }] : []
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
        },
        {
            path: "/document/:id",
            element: <EditorContainer />
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