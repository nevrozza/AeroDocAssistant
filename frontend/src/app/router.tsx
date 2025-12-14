import {createBrowserRouter, Route, createRoutesFromElements} from "react-router";
import {DummyPage} from "../pages";
import {AiChatBox} from "../components";


const Dummy2 = () => {
    return <div>Dummy2</div>;
};

const routes = createRoutesFromElements(
    <>
        <Route path="/" element={<AiChatBox/>}/>
        <Route path="/dummy" element={<DummyPage count={10}/>}/>
        <Route path="/2" Component={Dummy2}/>
    </>,
);

export const router = createBrowserRouter(routes);


const ErrorFallback = () => {
    return <div>error</div>;
};
export default ErrorFallback;