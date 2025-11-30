import { createBrowserRouter } from 'react-router-dom';
import PageLayout from '../pages/PageLayout';

const useRouter = () => {
    const routes = [
        {
            path: "/login",
            element: <div>Login Page</div>
        },
        {
            path: "/register",
            element: <div>Register Page</div>
        }
    ];

    const protectedRoutes = [
        {
            path: "/documents",
            element: <div>Documents Page - Protected</div>
        },

    ];


    const finalRoutes = [
        {
            path: "/",
            element: <PageLayout />,
            children: [...routes, ...protectedRoutes]
        }
    ];

    return createBrowserRouter(finalRoutes);
}

export default useRouter;