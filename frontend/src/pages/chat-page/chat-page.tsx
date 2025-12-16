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


const ChatPage: FC = () => {
    const chatBoxRef = useRef<HTMLDivElement>(null);


    const {chatId} = useParams<{ chatId?: string }>();

    const viewModel = chatPageViewModel(chatId)
    const chatsSheetViewModel = chatSheetViewModel(chatId)

    const chatBoxHeight = getChatboxHeight(chatBoxRef);

    return (<div>
        <div className="chat-page">
            <div className="desktop-chats-sheet">
                <ChatsSheet viewModel={chatsSheetViewModel}/>
            </div>
            <div className="chat-content">
                { chatId ? <MessagesFeed chatBoxHeight={chatBoxHeight} messages={viewModel.chatContent?.messages} />:
                    <div>New chat</div>
                }
                <div className="chat-input-container" ref={chatBoxRef}>
                    <AiChatBox
                        inputRowWidth={Math.min(useResize(parent).width * .7, 700)}/> {/*Не в CSS (см message container): workaround баг, когда пропадает значок микрофона: resizing*/}
                </div>

                <div className="chat-page-highlight-blur"/>
            </div>
        </div>

        <TopScrollShadow/>
        <BottomScrollShadow/>
    </div>);
};

export default ChatPage;