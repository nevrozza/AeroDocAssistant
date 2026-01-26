import type {IDocument, IMessage} from "../api/chat-models.ts";
import type {FC} from "react";
import {MyMessage, Spacer} from "../../../widgets";
import ResponseMessage from "./response-message/response-message.tsx";
import {MessageContainer} from "./message-container.tsx";
import React from "react";

export interface MessageFeedProps {
    messages: IMessage[] | undefined;
    documents: IDocument[];
    chatBoxHeight: number;
    widthStyle: string;
    bottomPadding: number;
}

const MessagesFeed: FC<MessageFeedProps> = ({messages, documents, chatBoxHeight, widthStyle, bottomPadding}) => {

    if (!messages) {
        return <div>loading</div>
    } else {
        return (<div className="chat-messages-scroll-wrapper">
            <MessageContainer widthStyle={widthStyle} key={"MessageContainer"} chatBoxHeight={chatBoxHeight}>
                {
                    messages.map((message, index) => {
                        if (message.isMine) {
                            return (
                                <React.Fragment key={index}>
                                    <MyMessage key={index} text={message.text}/>
                                    <Spacer key={"Spacer"+index} height={10}/>
                                </React.Fragment>
                            )
                        } else {
                            return <React.Fragment key={index}>
                                <ResponseMessage showFileButton={widthStyle == "chat-messages-container-width"} key={index} message={message} documents={documents}/>
                                <Spacer key={"Spacer"+index} height={20}/>
                            </React.Fragment>
                        }
                    })


                }
                <Spacer height={bottomPadding}/>
            </MessageContainer>
        </div>)
    }
}

export default MessagesFeed;
