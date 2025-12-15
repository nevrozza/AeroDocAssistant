import {useState} from "react";

export interface IChat {
    chatId: string;
    chatName: string;
}

export interface ChatSheetViewModel {
    chats: IChat[];
    pickedId: string;
    onChatClick: (id: string) => void;
    onCreateChatClick: () => void;
}

// TODO
const chatSheetViewModel = (): ChatSheetViewModel => {
    const [chats, setChats] = useState<IChat[]>([
        {chatId: "1", chatName: "chatName1"},
        {chatId: "2", chatName: "chatName2"},
        {chatId: "3", chatName: "chatName2"},
        {chatId: "4", chatName: "chatName2"},
        {chatId: "5", chatName: "chatName2"},
        {chatId: "6", chatName: "chatName2"},
        {chatId: "7", chatName: "chatName2"},
        {chatId: "8", chatName: "chatName2"},
        {chatId: "9", chatName: "chatName2"},
        {chatId: "10", chatName: "chatName2"},
        {chatId: "11", chatName: "chatName2"},
        {chatId: "12", chatName: "chatName2"},
        {chatId: "13", chatName: "chatName2"},
        {chatId: "14", chatName: "chatName2"},
        {chatId: "15", chatName: "chatName2"},
        {chatId: "16", chatName: "chatName2"},
        {chatId: "17", chatName: "chatName2"},
        {chatId: "18", chatName: "chatName2"},
        {chatId: "19", chatName: "chatName2"},
        {chatId: "20", chatName: "chatName2"},
        {chatId: "21", chatName: "chatName2"},
        {chatId: "22", chatName: "chatName2"},
        {chatId: "23", chatName: "chatName2"},
    ])
    const [pickedId, setPickedId] = useState<string>("") // it's ok if not null?

    const onChatClick = (id: string): void => {
        setPickedId(id);
    }

    const onCreateChatClick = (): void => {
        setPickedId("new-id")
    }

    return { chats: chats, pickedId: pickedId, onChatClick: onChatClick, onCreateChatClick: onCreateChatClick }
}
export default chatSheetViewModel