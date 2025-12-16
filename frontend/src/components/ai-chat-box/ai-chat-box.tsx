import "./ai-chat-box.css";
import {type AIChatBoxViewModel} from "./ai-chat-box-vm.ts";
import {colors, IconButton, OutlinedButton, TextField} from "../../widgets";
import {LuMic, LuSend, LuSlack} from "react-icons/lu";
import {useState} from "react";
import {StringUtils} from "../../shared";

export interface AIChatBoxProps {
    inputRowWidth?: number,
    viewModel: AIChatBoxViewModel,
}


const AiChatBox = (props: AIChatBoxProps) => {
    const viewModel: AIChatBoxViewModel = props.viewModel;

    const [inputBlank, setInputBlank] = useState<boolean>(true)

    return (
        <div>
            <div className="ai-chat-box">
                <OutlinedButton text={"Граф знаний"} icon={LuSlack} blury={true}/>
                <div className="ai-chat-box-input-row">
                    <div style={{width: props.inputRowWidth || ''}}>
                        <TextField ref={viewModel.textFieldRef} trailingIcon={LuMic} trailingIconHidable={true}
                                   maxLines={15} onChange={(event) => {
                            setInputBlank(StringUtils.isBlank(event.target.value));
                        }}/>
                    </div>
                    <IconButton icon={LuSend}
                                iconColor={inputBlank ? colors.onBackground : colors.primary} radius={60} iconSize={24}
                                enabled={!inputBlank}
                                onClick={viewModel.onSendClick}/>

                </div>
            </div>
        </div>
    )
};

export default AiChatBox;