import type {IFragment} from "../../../api/chat-models.ts";

export interface ITextPart {
    text: string,
}

export interface IQuotePart {
    quote: string;
    fragment: IFragment
}

export type IMessagePart = ITextPart | IQuotePart;


export function isQuotePart(part: IMessagePart): part is IQuotePart {
    return 'quote' in part && 'fragment' in part;
}

export function isTextPart(part: IMessagePart): part is ITextPart {
    return 'text' in part && !('quote' in part);
}