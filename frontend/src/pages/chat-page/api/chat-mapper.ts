import type {ChatContentDTO, ChatMetadataDTO, DocumentDTO, FragmentDTO, MessageDTO} from "./chat-dtos.ts";
import type {IChatContent, IChatMetadata, IDocument, IFragment, IMessage} from "./chat-models.ts";


export class ChatMapper {
    static metadataToDomain(dto: ChatMetadataDTO): IChatMetadata {
        return {
            chatId: dto.chat_id,
            title: dto.title
        }
    }

    static contentToDomain(dto: ChatContentDTO): IChatContent {
        const fragments: IFragment[] = dto.used_fragments.map(this.fragmentToDomain);
        const documents: IDocument[] = dto.used_documents.map(this.documentToDomain);
        return {
            chatId: dto.chat_id,
            title: dto.title,
            messages: dto.messages.map((message) => {
                return this.messageToDomain(message, fragments)
            }),
            usedDocuments: documents,
        }
    }


    static messageToDomain(dto: MessageDTO, allFragments: IFragment[]): IMessage {
        const usedFragments = dto.used_fragments
            .map(fragmentId => {
                return allFragments.find(fragment => fragment.id === fragmentId);
            })
            .filter((fragment): fragment is IFragment => fragment !== undefined);
        return {isMine: dto.role === "user", text: dto.text, usedFragments: usedFragments};
    }

    static documentToDomain(dto: DocumentDTO): IDocument {
        return {
            documentId: dto.document_id, title: dto.title
        }
    }

    static fragmentToDomain(dto: FragmentDTO): IFragment {
        return {
            id: dto.fragment_id,
            documentId: dto.source,
            documentPage: dto.source_page,
            text: dto.text
        }
    }

}

