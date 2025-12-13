import "./dummy-page.css"
import type {FC} from "react";

interface DummyPageProps {
    count: number;
}

const DummyPage: FC<DummyPageProps> = ({count}) => {
    return <h1>Dummy+{count}</h1>;
};

export default DummyPage;