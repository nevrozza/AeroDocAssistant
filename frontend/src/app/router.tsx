import {createBrowserRouter, Route, createRoutesFromElements} from "react-router";
import {ChatPage, DummyPage, GraphPage, PreviewPage} from "../pages";


const Dummy2 = () => {
    return <div>Dummy2</div>;
};

const routes = createRoutesFromElements(
    <>
        <Route path="/" element={<ChatPage/>}/>
        <Route path="/chats" element={<ChatPage/>}/>
        <Route path="/chats/:chatId" element={<ChatPage/>}/>
        <Route path="/documents/:documentId" element={<PreviewPage/>}/>


        <Route path="/dummy" element={<DummyPage count={10}/>}/>
        <Route path="/2" Component={Dummy2}/>
        <Route path="graph" element={<GraphPage/>}/>
    </>,
);

export const router = createBrowserRouter(routes);


const ErrorFallback = () => {
    return <div>error</div>;
};
export default ErrorFallback;