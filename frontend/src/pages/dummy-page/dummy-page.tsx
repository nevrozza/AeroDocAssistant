import "./dummy-page.css"
import {useRef, type FC} from "react";
import {ThemeButton} from "../../components";
import {IconButton, TextField} from "../../widgets";
import { LuMic, LuSend } from "react-icons/lu";


interface DummyPageProps {
    count: number;
}

const DummyPage: FC<DummyPageProps> = ({count}) => {
    const ref = useRef<HTMLTextAreaElement>(null)
    
    return <div>
        <h1>Dummy+{count}</h1>
        <ThemeButton/>
        <TextField trailingIcon={LuMic} ref={ref}></TextField>
        <IconButton icon={LuSend} onClick={ () => console.log(ref.current?.value) }/>
    </div>;
};

export default DummyPage;