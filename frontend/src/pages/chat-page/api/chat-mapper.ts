import type {ChatMetadataDTO} from "./chat-dtos.ts";
import type {IChatMetadata} from "./chat-models.ts";


export class ChatMapper {
    static metadataToDomain(dto: ChatMetadataDTO): IChatMetadata {
        return {
            id: dto.chat_id,
            title: dto.title
        }
    }
}

