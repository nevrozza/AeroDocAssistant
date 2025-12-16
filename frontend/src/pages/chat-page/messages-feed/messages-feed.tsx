import type {IMessage} from "../api/chat-models.ts";
import type {FC} from "react";
import {MyMessage} from "../../../widgets";
import ResponseMessage from "./response-message/response-message.tsx";
import {MessageContainer} from "./message-container.tsx";

export interface MessageFeedProps {
    messages: IMessage[] | undefined;
    chatBoxHeight: number
}

const MessagesFeed: FC<MessageFeedProps> = ({messages, chatBoxHeight}) => {
    if (!messages) {
        return <div>loading</div>
    } else {
        return (<div className="chat-messages-scroll-wrapper">
            <MessageContainer chatBoxHeight={chatBoxHeight}>
                {
                    messages.map((message, index) => {
                        if (message.isMine) {
                            return <MyMessage key={index} text={message.text}/>
                        } else {
                            return <ResponseMessage key={index} message={message}/>
                        }
                    })
                }
            </MessageContainer>
        </div>)
    }
}

export default MessagesFeed;
