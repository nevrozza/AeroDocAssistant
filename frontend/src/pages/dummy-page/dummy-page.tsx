import "./dummy-page.css"
import type {FC} from "react";
import {ThemeButton} from "../../components";
import { TextField } from "../../widgets";
import { LuSunMoon } from "react-icons/lu";


interface DummyPageProps {
    count: number;
}

const DummyPage: FC<DummyPageProps> = ({count}) => {
    return <div>
        <h1>Dummy+{count}</h1>
        <ThemeButton/>
        <TextField trailingIcon={LuSunMoon}></TextField>
    </div>;
};

export default DummyPage;