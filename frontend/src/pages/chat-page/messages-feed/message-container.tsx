import type {FC, PropsWithChildren} from "react";
import {Spacer} from "../../../widgets";

export interface MessageContainerProps {
    chatBoxHeight: number;
    widthStyle: string
}

export const MessageContainer: FC<PropsWithChildren<MessageContainerProps>> = (props) => {
    return (<div className={`chat-messages-container ${props.widthStyle}`}>
        <Spacer height={50}/>
        {props.children}
        <Spacer height={`calc(${props.chatBoxHeight}px + var(--bottom-chatbox-padding))`}/>
    </div>)
}