import {ErrorBoundary} from "react-error-boundary";
import {StrictMode} from "react";
import {RouterProvider} from "react-router";
import ErrorFallback, {router} from "./router.tsx";


export default function App() {
    return (
        <StrictMode>
            <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => console.error("ss" + error.message)}>
                <RouterProvider router={router}/>
            </ErrorBoundary>
        </StrictMode>
    );
}



