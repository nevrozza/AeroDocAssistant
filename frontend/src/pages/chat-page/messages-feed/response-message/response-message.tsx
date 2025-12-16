import {type FC} from 'react';
import {parseMessage} from "./parse-message.ts";
import {isQuotePart, isTextPart} from "./parts/parts.ts";
import TextPartComponent from "./parts/text-part-component.tsx";
import QuotePartComponent from "./parts/quote-part-component.tsx";
import './response-message.css'
import type {IFragment, IMessage} from "../../api/chat-models.ts";


export interface ResponseMessageProps {
    message: IMessage;
}


const ResponseMessage: FC<ResponseMessageProps> = ({message}) => {
    const fragmentMap = message.usedFragments.reduce((map, fragment) => {
        map.set(fragment.id, fragment);
        return map;
    }, new Map<string, IFragment>());

    const parts = parseMessage(message.text, fragmentMap);
    return <div className="response-message">
        {parts.map((part, index) => {
            switch (true) {
                case isTextPart(part):
                    return <TextPartComponent key={index} part={part} />;
                case isQuotePart(part):
                    return <QuotePartComponent key={index} part={part}/>;
                default:
                    console.error('Неизвестный тип части');
                    return null;
            }
        })}
    </div>

};

export default ResponseMessage;