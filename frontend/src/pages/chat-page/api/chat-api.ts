import type {ChatContentDTO, ChatMetadataDTO} from "./chat-dtos.ts";
import {apiClient} from "../../../shared";

export const chatApi = {
    fetchChatMetadataList: async (): Promise<ChatMetadataDTO[]> => {
        return (await apiClient.get("/chat/list/")).data
    },

    fetchChatContent: async (chatId: string): Promise<ChatContentDTO> => {
        return (await apiClient.get(`/chat/${chatId}/`)).data
    },

    createChat: async (): Promise<ChatMetadataDTO> => {
        return (await apiClient.post(`/chat/create`)).data
    }
}