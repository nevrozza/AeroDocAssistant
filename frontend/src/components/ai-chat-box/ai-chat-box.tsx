import "./ai-chat-box.css";
import aiChatBox, {type AiChatBoxViewModel} from "./ai-chat-box.ts";
import {colors, IconButton, OutlinedButton, TextField} from "../../widgets";
import {LuMic, LuSend, LuSlack} from "react-icons/lu";
import {useResize} from "../../shared";


const AiChatBox = () => {
    const viewModel: AiChatBoxViewModel = aiChatBox();


    const inputRowWidth = Math.min(useResize(parent).width * .7, 700)

    return (
        <div>
            <div className="ai-chat-box">
                <OutlinedButton text={"Граф знаний"} icon={LuSlack}/>
                <div className="input-row">
                    <div className="textfield-wrapper" style={{ width: inputRowWidth }}>
                        <TextField ref={viewModel.textFieldRef} trailingIcon={LuMic} trailingIconHidable={true} maxLines={15}/>
                    </div>
                    <IconButton icon={LuSend} iconColor={colors.primary} radius={60} iconSize={24}
                                onClick={viewModel.onSendClick}/>
                </div>
            </div>
        </div>

    )
};

export default AiChatBox;