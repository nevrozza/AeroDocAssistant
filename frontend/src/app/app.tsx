import {ErrorBoundary} from "react-error-boundary";
import {StrictMode} from "react";
import {RouterProvider} from "react-router";
import ErrorFallback, {router} from "./router.tsx";
import {queryClient, useResize} from "../shared";
import {QueryClientProvider} from "@tanstack/react-query";

export default function App() {
    const {width, height} = useResize(window)


    document.documentElement.style.setProperty('--winner', `${width}px`);
    document.documentElement.style.setProperty('--hinner', `${height}px`);


    return (
        <StrictMode>
            <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => console.error("ss" + error.message)}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router}/>
                </QueryClientProvider>
            </ErrorBoundary>
        </StrictMode>
    );
}



