import "./chat-page.css"
import {type FC, useRef} from "react";
import {useResize} from "../../shared";
import {AiChatBox, ThemeButton} from "../../components";
import {BottomScrollShadow, TopScrollShadow} from "./utils/scroll-shadows.tsx";
import {MessageContainer} from "./utils/message-container.tsx";
import {getChatboxHeight} from "./utils/get-chatbox-height.ts";


const ChatPage: FC = () => {

    const inputRowWidth = Math.min(useResize(parent).width * .7, 700)

    const chatBoxRef = useRef<HTMLDivElement>(null);

    const chatBoxHeight = getChatboxHeight(chatBoxRef);

    return (<div>
        <div className="chat-page">
            <div className="overlay"><ThemeButton/></div>
            <MessageContainer chatBoxHeight={chatBoxHeight}>
                {
                    (() => {
                        const elements = [];
                        for (let i = 1; i <= 60; i++) {
                            elements.push(<div key={i}>Сообщение{i}</div>);
                        }
                        return elements;
                    })()
                }
            </MessageContainer>

            <div className="chat-input-container" ref={chatBoxRef}>
                <AiChatBox inputRowWidth={inputRowWidth}/>
            </div>


            <div className="highlight-blur">
            </div>
        </div>

        <TopScrollShadow/>
        <BottomScrollShadow/>
    </div>);
};

export default ChatPage;