import "./dummy-page.css"
import {useRef, useState, type FC} from "react";
import {ThemeButton} from "../../components";
import {IconButton, OutlinedButton, SelectButton, TextField} from "../../widgets";
import {LuMic, LuSend, LuSlack} from "react-icons/lu";


interface DummyPageProps {
    count: number;
}

const DummyPage: FC<DummyPageProps> = ({count}) => {
    const ref = useRef<HTMLTextAreaElement>(null)
    const [flag, setFlag] = useState(false)

    return <div>
        <h1>Dummy+{count}</h1>
        <ThemeButton/>
        <TextField trailingIcon={LuMic} ref={ref}/>
        <IconButton icon={LuSend} onClick={() => console.log(ref.current?.value)}/>
        <OutlinedButton text="Граф знаний" icon={LuSlack}/>
        <SelectButton text="Какой хороший день, чтоб пойти на матан" isSelected={flag} onClick={() => (setFlag(!flag))}></SelectButton>
        <SelectButton text="Какой хороший день, чтоб пойти на матан" isSelected={false}></SelectButton>
        <SelectButton text="Какой хороший день, чтоб пойти на матан" isSelected={false}></SelectButton>
    </div>;
};

export default DummyPage;