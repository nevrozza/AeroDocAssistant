import "./dummy-page.css"
import type {FC} from "react";
import {LuIceCreamCone} from "react-icons/lu"
import {IconButton, colors} from "../../widgets";


interface DummyPageProps {
    count: number;
}

const DummyPage: FC<DummyPageProps> = ({count}) => {
    return <div>
        <h1>Dummy+{count}</h1>
        <IconButton icon={LuIceCreamCone} iconColor={colors.onBackground}/>
    </div>;
};

export default DummyPage;