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
    const [chats, setChats] = useState<IChat[]>([])
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