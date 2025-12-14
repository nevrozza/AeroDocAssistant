import "./dummy-page.css"
import {useRef, type FC} from "react";
import {ThemeButton} from "../../components";
import { TextField } from "../../widgets";
import { LuMic } from "react-icons/lu";


interface DummyPageProps {
    count: number;
}

const DummyPage: FC<DummyPageProps> = ({count}) => {
    const ref = useRef<HTMLInputElement>(null)
    
    return <div>
        <h1>Dummy+{count}</h1>
        <ThemeButton/>
        <TextField trailingIcon={LuMic} value="123" ref={ref}></TextField>
    </div>;
};

export default DummyPage;