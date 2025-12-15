import type {FC, PropsWithChildren} from "react";
import {Spacer} from "../../../widgets";

export interface MessageContainerProps {
    chatBoxHeight: number;
}

export const MessageContainer: FC<PropsWithChildren<MessageContainerProps>> = (props) => {
    return (<div className="chat-messages-container">
        <Spacer height={100}/>
        {props.children}
        <Spacer height={`calc(${props.chatBoxHeight}px + var(--bottom-chatbox-padding))`}/>
    </div>)
}