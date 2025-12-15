import React, {type FC} from 'react';
import {parseMessage} from "./parse-message.ts";
import type {IFragment} from "../../../shared/entities/fragment.ts";
import {isQuotePart, isTextPart} from "./parts/parts.ts";
import TextPartComponent from "./parts/text-part-component.tsx";
import QuotePartComponent from "./parts/quote-part-component.tsx";
import './response-message.css'


export interface ResponseMessageProps {
    message?: string;
}

const exampleMessage = `В авиастроении используются композитные материалы, в основном углепластик.
{{{[frag:e0c5ca62-7aa4-4b95-983e-5bc067d545a1] Планер самолета Boeing 787 более чем на 50% по весу состоит из композитных материалов, в основном углепластика}}}`;

const exampleFragments: IFragment[] = [
    {
        id: "e0c5ca62-7aa4-4b95-983e-5bc067d545a1",
        text: "Планер самолета Boeing 787 более чем на 50% по весу состоит из композитных материалов, в основном  углепластика",
        sourceId: "source-123",
        sourcePage: 1
    }
];

const ResponseMessage: FC<ResponseMessageProps> = ({message}) => {
    const fragmentMap = exampleFragments.reduce((map, fragment) => {
        map.set(fragment.id, fragment);
        return map;
    }, new Map<string, IFragment>());

    const parts = parseMessage(exampleMessage, fragmentMap);
    return <div className="response-message">
        {parts.map((part, index) => {
            // Вариант 1: Type guard функция
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