import "./chats-sheet.css"

import {type FC} from 'react';
import type {ChatSheetViewModel} from "./chats-sheet-vm.ts";
import {colors, IconButton, OutlinedButton, SelectButton, Spacer} from "../../../widgets";
import {LuArrowLeft, LuPlus} from "react-icons/lu";
import {ThemeButton} from "../../../components";

export interface ChatsSheetProps {
    viewModel: ChatSheetViewModel;

}


const ChatsSheet: FC<ChatsSheetProps> = ({viewModel}) => {
    return (
        <div className="chats-sheet-container">
        <div className="chats-sheet-header">
            {/*for mobiles*/}
            <IconButton icon={LuArrowLeft} containerColor={colors.transparent} enabled={false} opacity={0}/>
            <div className="chats-sheet-title">
                AeroDoc
            </div>
            <ThemeButton/>
        </div>
        <div className="chats-sheet-create-button">
            <OutlinedButton text="Новый чат" icon={LuPlus} width={"250px"} onClick={viewModel.onCreateChatClick}/>
        </div>
        <div className="chats-sheet-content">
            <Spacer height={20}/>
            {viewModel.chats.map((chat) => (
                <SelectButton key={chat.chatId} text={chat.title} isSelected={chat.chatId === viewModel.pickedId}
                              onClick={() => {
                                  viewModel.onChatClick(chat.chatId)
                              }}/>
            ))}
            <Spacer height={20}/>
        </div>
    </div>)
}

export default ChatsSheet;