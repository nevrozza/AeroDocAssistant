import "./dummy-page.css"
import {useRef, type FC} from "react";
import {ThemeButton} from "../../components";
import {colors, IconButton, OutlinedButton, TextField} from "../../widgets";
import {LuMic, LuSend, LuSlack, LuPlus, LuFile} from "react-icons/lu";
import SelectButton from "../../widgets/select-button/select-button";
import MyMessage from "../../widgets/my-message/my-message";


interface DummyPageProps {
    count: number;
}

const DummyPage: FC<DummyPageProps> = ({count}) => {
    const ref = useRef<HTMLTextAreaElement>(null)

    return <div>
        <h1>Dummy+{count}</h1>
        <ThemeButton/>
        <TextField trailingIcon={LuMic} ref={ref}/>
        <IconButton icon={LuSend} onClick={() => console.log(ref.current?.value)}/>
        <OutlinedButton text="Граф знаний" icon={LuSlack}/>
        <OutlinedButton icon={LuPlus} text="Новый чат"/>
        <SelectButton></SelectButton>
        <MyMessage text={"Hello, World"}></MyMessage>
        <div className="quote-part-file">
                                <IconButton icon={LuFile} containerColor={colors.primaryContainer} iconColor={colors.onPrimaryContainer} iconSize={24}/>
                            </div>
    </div>;
};

export default DummyPage;