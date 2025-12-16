export interface IFragment {
    id: string;
    text: string;
    documentId: string;
    documentPage: number;
}


export interface IMessage {
    isMine: boolean;
    text: string;
    usedFragments: IFragment[];
}

export interface IDocument {
    documentId: string;
    title: string;
}


export interface IChatMetadata {
    chatId: string;
    title: string;
}

export interface IChatContent extends IChatMetadata {
    messages: IMessage[];
    usedDocuments: IDocument[];
}