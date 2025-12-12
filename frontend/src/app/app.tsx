import {RouterProvider} from "react-router";
import {ErrorBoundary} from "react-error-boundary";
import {StrictMode} from "react";
import {router} from "./router.tsx";


export default function App() {
    return (
        <StrictMode>
            <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => console.error(error)}>
                <RouterProvider router={router}/>
            </ErrorBoundary>
        </StrictMode>
    );
}


const ErrorFallback = () => {
    return <div>error</div>;
};
