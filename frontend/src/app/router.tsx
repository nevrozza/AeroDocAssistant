import {Route, createRoutesFromElements} from 'react-router-dom'
import {createBrowserRouter} from "react-router";

const Dummy = () => {
    return <div>Dummy</div>;
};
const Dummy2 = () => {
    return <div>Dummy2</div>;
};

const routes = createRoutesFromElements(
    <>
        <Route path="/" Component={Dummy} />
        <Route path="/2" Component={Dummy2} />
    </>
);

export const router = createBrowserRouter(routes);


