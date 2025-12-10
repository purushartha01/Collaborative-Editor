import { useState } from "react";
import { useEffect } from "react"
import { Link } from "react-router-dom";

const AuthError = () => {

    const [error, setError] = useState(null);
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const error = new URLSearchParams(window.location.search).get('error');
        const details = new URLSearchParams(window.location.search).get('details');

        if (error && details) {
            console.error(`Authentication Error: ${error} - ${details}`);
            setError(error);
            setDetails(details);
        } else {
            setError('unknown_error');
            setDetails('No additional details provided');
        }

    }, [])

    return (
        <div className="h-screen w-screen grid place-items-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Authentication Error</h1>
                <p className="text-lg">An error occurred during authentication.</p>
                {error && <p className="mt-2">Error: <span className="font-mono">{error}</span></p>}
                {details && <p className="mt-1">Details: <span className="font-mono">{details}</span></p>}
                <p className="mt-4">Please try signing in again.</p>
                <Link to="/" className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:no-underline">
                    Go to Home
                </Link>
            </div>
        </div>
    )
}

export default AuthError