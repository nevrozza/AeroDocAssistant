import "./chat-page.css"
import {type FC, useRef} from "react";
import {AiChatBox, ThemeButton} from "../../components";
import {BottomScrollShadow, TopScrollShadow} from "./utils/scroll-shadows.tsx";
import {MessageContainer} from "./messages-feed/message-container.tsx";
import {getChatboxHeight} from "./utils/get-chatbox-height.ts";
import {MyMessage, Spacer} from "../../widgets";
import ResponseMessage from "./messages-feed/response-message/response-message.tsx";
import {useResize} from "../../shared";
import ChatsSheet from "./chats-sheet/chats-sheet.tsx";
import chatSheetViewModel from "./chats-sheet/chats-sheet-vm.ts";


const ChatPage: FC = () => {


    const chatBoxRef = useRef<HTMLDivElement>(null);

    const chatBoxHeight = getChatboxHeight(chatBoxRef);

    return (<div>
        <div className="chat-page">
            <div className="desktop-chats-sheet">
            <ChatsSheet viewModel={chatSheetViewModel()}/>
            </div>
            <div className="chat-content">
                <MessageContainer chatBoxHeight={chatBoxHeight}>
                    {
                        (() => {
                            const elements = [];
                            for (let i = 1; i <= 60; i++) {
                                elements.push(<MyMessage key={i} text={"Какие материалы у нас используются?"}/>);
                                elements.push(<Spacer key={"Spacer" + i} height={10}/>)
                                elements.push(<ResponseMessage key={"response" + i}/>);
                                elements.push(<Spacer key={"lastSpacer" + i} height={20}/>)
                            }
                            return elements;
                        })()
                    }
                </MessageContainer>
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