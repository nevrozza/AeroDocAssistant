import "./dummy-page.css"
import {useRef, type FC} from "react";
import {ThemeButton} from "../../components";
import { OutlinedButton, TextField } from "../../widgets";
import { LuSunMoon } from "react-icons/lu";


interface DummyPageProps {
    count: number;
}

const DummyPage: FC<DummyPageProps> = ({count}) => {
    const ref = useRef<HTMLInputElement>(null)
    
    return <div>
        <h1>Dummy+{count}</h1>
        <ThemeButton/>
        <TextField trailingIcon={LuSunMoon} value="123" ref={ref}></TextField>
        <OutlinedButton text="Граф знаний" icon={LuSunMoon}></OutlinedButton>
    </div>;
};

export default DummyPage;