import type {FC, PropsWithChildren} from "react";

export interface MessageContainerProps {
    chatBoxHeight: number;
}

export const MessageContainer: FC<PropsWithChildren<MessageContainerProps>> = (props) => {
    return (<div className="chat-messages-container">
        <div style={{height: 100}}/>
        {props.children}
        <div style={{transition: "height 600ms", height: props.chatBoxHeight + 100}}/>
    </div>)
}