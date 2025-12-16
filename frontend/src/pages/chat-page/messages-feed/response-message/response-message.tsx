import {type FC} from 'react';
import {parseMessage} from "./parse-message.ts";
import {isQuotePart, isTextPart} from "./parts/parts.ts";
import TextPartComponent from "./parts/text-part-component.tsx";
import QuotePartComponent from "./parts/quote-part-component.tsx";
import './response-message.css'
import type {IDocument, IFragment, IMessage} from "../../api/chat-models.ts";


export interface ResponseMessageProps {
    message: IMessage;
    documents: IDocument[];
}


const ResponseMessage: FC<ResponseMessageProps> = ({message, documents}) => {
    const fragmentMap = message.usedFragments.reduce((map, fragment) => {
        map.set(fragment.id, fragment);
        return map;
    }, new Map<string, IFragment>());

    const documentsMap = documents.reduce((map, document) => {
        map.set(document.documentId, document);
        return map;
    }, new Map<string, IDocument>());

    const parts = parseMessage(message.text, fragmentMap, documentsMap);
    let quoteCount = 0;
    return <div className="response-message">
        {parts.map((part, index) => {
            switch (true) {
                case isTextPart(part):
                    return <TextPartComponent key={index} part={part} />;
                case isQuotePart(part):
                    quoteCount++
                    return <QuotePartComponent key={index} part={part} num={quoteCount}/>;
                default:
                    console.error('Неизвестный тип части');
                    return null;
            }
        })}
    </div>

};

export default ResponseMessage;