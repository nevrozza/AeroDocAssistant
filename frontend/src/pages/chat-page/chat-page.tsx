import "./chat-page.css"
import {type FC, useRef} from "react";
import {AiChatBox, ThemeButton} from "../../components";
import {BottomScrollShadow, TopScrollShadow} from "./utils/scroll-shadows.tsx";
import {MessageContainer} from "./utils/message-container.tsx";
import {getChatboxHeight} from "./utils/get-chatbox-height.ts";
import {MyMessage, Spacer} from "../../widgets";
import ResponseMessage from "./response-message/response-message.tsx";
import {useResize} from "../../shared";


const ChatPage: FC = () => {


    const chatBoxRef = useRef<HTMLDivElement>(null);

    const chatBoxHeight = getChatboxHeight(chatBoxRef);
    const inputRowWidth = Math.min(useResize(parent).width * .7, 700) // Не в CSS (см message container): workaround баг, когда пропадает значок микрофона: resizing

    return (<div>
        <div className="chat-page">
            <div className="chat-page-overlay"><ThemeButton/></div>
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
                    inputRowWidth={inputRowWidth}/> {/*Не в CSS (см message container): workaround баг, когда пропадает значок микрофона: resizing*/}
            </div>


            <div className="chat-page-highlight-blur">
            </div>
        </div>

        <TopScrollShadow/>
        <BottomScrollShadow/>
    </div>);
};

export default ChatPage;