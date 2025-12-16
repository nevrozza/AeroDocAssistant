import "./chat-page.css"
import {type FC, useRef} from "react";
import {AiChatBox} from "../../components";
import {BottomScrollShadow, TopScrollShadow} from "./utils/scroll-shadows.tsx";
import {getChatboxHeight} from "./utils/get-chatbox-height.ts";
import {useResize} from "../../shared";
import ChatsSheet from "./chats-sheet/chats-sheet.tsx";
import chatSheetViewModel from "./chats-sheet/chats-sheet-vm.ts";
import {useParams} from "react-router-dom";
import chatPageViewModel from "./chat-page-vm.ts";
import MessagesFeed from "./messages-feed/messages-feed.tsx";
import aiChatBoxViewModel from "../../components/ai-chat-box/ai-chat-box-vm.ts";


const ChatPage: FC = () => {
    const chatBoxRef = useRef<HTMLDivElement>(null);


    const {chatId} = useParams<{ chatId?: string }>();

    const chatsSheetViewModel = chatSheetViewModel(chatId)
    const viewModel = chatPageViewModel(chatId, chatsSheetViewModel.refetchChats)

    const chatBoxHeight = getChatboxHeight(chatBoxRef);

    const handleSendMessage = (text: string) => {
        try {
            viewModel.sendMessage(text);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };
    console.log("xxx:", viewModel.chatContent)
    return (<div>
        <div className="chat-page">
            <div className="desktop-chats-sheet">
                <ChatsSheet viewModel={chatsSheetViewModel}/>
            </div>
            <div className="chat-content">

                {chatId ? <MessagesFeed chatBoxHeight={chatBoxHeight} messages={viewModel.chatContent?.messages}
                                        documents={viewModel.chatContent?.usedDocuments || []}/> :
                    <div>New chat</div>
                }
                <div className="chat-input-container" ref={chatBoxRef}>
                    <AiChatBox
                        inputRowWidth={Math.min(useResize(parent).width * .7, 700)}
                        viewModel={aiChatBoxViewModel(handleSendMessage)}
                    /> {/*Не в CSS (см message container): workaround баг, когда пропадает значок микрофона: resizing*/}
                </div>

                <div className="chat-page-highlight-blur"/>
            </div>
        </div>

        <TopScrollShadow/>
        <BottomScrollShadow/>
    </div>);
};

export default ChatPage;