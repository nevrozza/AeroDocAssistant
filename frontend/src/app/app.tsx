import {ErrorBoundary} from "react-error-boundary";
import {StrictMode} from "react";
import {RouterProvider} from "react-router";
import ErrorFallback, {router} from "./router.tsx";
import {useResize} from "../shared";

export default function App() {
    const {width, height} = useResize(window)


    document.documentElement.style.setProperty('--winner', `${width}px`);
    document.documentElement.style.setProperty('--hinner', `${height}px`);


    return (
        <StrictMode>
            <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => console.error("ss" + error.message)}>
                <RouterProvider router={router}/>
            </ErrorBoundary>
        </StrictMode>
    );
}



