export interface DocumentDTO {
    document_id: string;
    title: string;
}

export interface FragmentDTO {
    fragment_id: string;
    text: string;
    source: string;
    source_page: number;
}

export interface MessageDTO {
    role: string;
    text: string;
    used_fragments: string[];
}

export interface ChatMetadataDTO {
    chat_id: string;
    title: string;
}

export interface ChatContentDTO extends ChatMetadataDTO {
    messages: MessageDTO[];
    used_fragments: FragmentDTO[];
    used_documents: DocumentDTO[];
}