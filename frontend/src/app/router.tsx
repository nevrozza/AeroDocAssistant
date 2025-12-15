import {createBrowserRouter, Route, createRoutesFromElements} from "react-router";
import {ChatPage, DummyPage, GraphPage} from "../pages";


const Dummy2 = () => {
    return <div>Dummy2</div>;
};

const routes = createRoutesFromElements(
    <>
        <Route path="/" element={<ChatPage/>}/>
        <Route path="/dummy" element={<DummyPage count={10}/>}/>
        <Route path="/2" Component={Dummy2}/>
        <Route path="graph" element={<GraphPage edges={[{source: "1", target: "2", id: "1-2", label: "1-2"}, {source: "2", target: "3", id: "2-3", label: "2-3"}, {source: "3", target: "1", id: "3-1", label: "3-1"}]}/>}/>
    </>,
);

export const router = createBrowserRouter(routes);


const ErrorFallback = () => {
    return <div>error</div>;
};
export default ErrorFallback;