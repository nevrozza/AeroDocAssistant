import "./chat-page.css"
import {type FC, useEffect, useRef, useState} from "react";
import {useResize} from "../../shared";
import {AiChatBox, ThemeButton} from "../../components";
import {colors} from "../../widgets";


const ChatPage: FC = () => {

    const inputRowWidth = Math.min(useResize(parent).width * .7, 700)

    const chatBoxRef = useRef<HTMLDivElement>(null);
    const [chatBoxHeight, setChatBoxHeight] = useState(0);

    useEffect(() => {
        if (chatBoxRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setChatBoxHeight(entry.contentRect.height);
                }
            });

            resizeObserver.observe(chatBoxRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    return <div className="chat-page">
        <div className="static">
            <ThemeButton/>
        </div>

        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "70px",
            background: `linear-gradient(to bottom, 
                ${colors.background} 0%, 
                ${colors.transparent} 100%)`,
            pointerEvents: "none", /* Чтобы клики проходили сквозь */
            zIndex: 5
        }} />
        <div className="chat-messages-container">
            <div style={{height: 100}}/>
            {(() => {
                const elements = [];
                for (let i = 1; i <= 50; i++) {
                    elements.push(<div key={i}>Сообщение{i}</div>);
                }
                return elements;
            })()}
            <div style={{transition: "height 600ms", height: chatBoxHeight+100}}/>
        </div>

        <div className="chat-input-container" ref={chatBoxRef}>
            <AiChatBox inputRowWidth={inputRowWidth}/>
        </div>

        <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100px",
            background: `linear-gradient(to top, 
                ${colors.background} 0%, 
                ${colors.transparent} 100%)`,
            pointerEvents: "none", /* Чтобы клики проходили сквозь */
            zIndex: 5
        }} />

        <div className="highlight">
        </div>
    </div>;
};

export default ChatPage;