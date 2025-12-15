import React, {type FC} from 'react';
import type {ChatSheetViewModel} from "./chats-sheet-vm.ts";
import {SelectButton} from "../../../widgets";

export interface ChatsSheetProps {
    viewModel: ChatSheetViewModel
}


const ChatsSheet: FC<ChatsSheetProps> = ({viewModel}) => {
    return (<div className="chats-sheet-container">
        {viewModel.chats.map((chat) => {
            return <SelectButton key={chat.chatId} text={chat.chatName} isSelected={chat.chatId === viewModel.pickedId}
                                 onClick={() => {viewModel.onChatClick(chat.chatId)}}/>
        }}
    </div>)
}

export default ChatsSheet;