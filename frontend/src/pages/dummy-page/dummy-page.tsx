import "./dummy-page.css"
import type {FC} from "react";
import {ThemeButton} from "../../components";


interface DummyPageProps {
    count: number;
}

const DummyPage: FC<DummyPageProps> = ({count}) => {
    return <div>
        <h1>Dummy+{count}</h1>
        <ThemeButton/>
    </div>;
};

export default DummyPage;