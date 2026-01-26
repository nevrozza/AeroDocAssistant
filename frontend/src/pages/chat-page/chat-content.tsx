import {type FC, useRef} from 'react';
import MessagesFeed from "./messages-feed/messages-feed.tsx";
import type {ChatPageViewModel} from "./chat-page-vm.ts";
import {getChatboxHeight} from "./utils/get-chatbox-height.ts";
import {AiChatBox} from "../../components";
import aiChatBoxViewModel from "../../components/ai-chat-box/ai-chat-box-vm.ts";
import "./chat-page.css";

export interface ChatContentProps {
    chatId: string | undefined;
    viewModel: ChatPageViewModel;
    inputRowWidth: number | string;
    isOverridenMessagesWidth: boolean;
    chatContentStyle: string;
    bottomPadding: number;
}


const ChatContent: FC<ChatContentProps> = ({chatId, viewModel, inputRowWidth, isOverridenMessagesWidth, chatContentStyle, bottomPadding}) => {
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const chatBoxHeight = getChatboxHeight(chatBoxRef);

    const handleSendMessage = (text: string) => {
        try {
            viewModel.sendMessage(text);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return <div className={chatContentStyle}>

        {chatId ? <MessagesFeed bottomPadding={bottomPadding} widthStyle={ isOverridenMessagesWidth ? "chat-messages-container-width-custom" : "chat-messages-container-width" } chatBoxHeight={chatBoxHeight} messages={viewModel.chatContent?.messages}
                                documents={viewModel.chatContent?.usedDocuments || []}/> :
            <div>New chat</div>
        }
        <div className="chat-input-container" ref={chatBoxRef}>
            <AiChatBox
                inputRowWidth={inputRowWidth}
                viewModel={aiChatBoxViewModel(handleSendMessage)}
            /> {/*Не в CSS (см message container): workaround баг, когда пропадает значок микрофона: resizing*/}
        </div>

        <div className="chat-page-highlight-blur"/>
    </div>
};

export default ChatContent;