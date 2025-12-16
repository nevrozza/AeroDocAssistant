import "./chat-page.css"
import {type FC} from "react";
import {BottomScrollShadow, TopScrollShadow} from "./utils/scroll-shadows.tsx";
import ChatsSheet from "./chats-sheet/chats-sheet.tsx";
import chatSheetViewModel from "./chats-sheet/chats-sheet-vm.ts";
import {useNavigate, useParams} from "react-router-dom";
import chatPageViewModel from "./chat-page-vm.ts";
import ChatContent from "./chat-content.tsx";
import {navigateToChat, queryClient, useResize} from "../../shared";
import type {IChatMetadata} from "./api/chat-models.ts";


const ChatPage: FC = () => {


    const {chatId} = useParams<{ chatId?: string }>();

    const navigate = useNavigate()

    const chatsSheetViewModel = chatSheetViewModel(chatId)
    const viewModel = chatPageViewModel(chatId, async (chatService, text) => {
        if (!chatId) {
            const chat = await chatService.createChat(undefined)
            navigateToChat(navigate, chat.chatId, true)
            await chatsSheetViewModel.refetchChats()
            queryClient.setQueryData<IChatMetadata[]>(
                ['chats', 'metadata'],
                (oldData) => {
                    if (!oldData) return oldData;
                    const index = oldData.findIndex(metadata => metadata.chatId === chat.chatId);
                    if (index !== -1) {
                        const newData = [...oldData];
                        newData[index] = {...newData[index], title: text};
                        return newData;
                    }
                    return oldData;
                }
            )
        }
    })


    console.log("xxx:", viewModel.chatContent)
    return (<div>
        <div className="chat-page">
            <div className="desktop-chats-sheet">
                <ChatsSheet viewModel={chatsSheetViewModel}/>
            </div>
            <ChatContent chatId={chatId} viewModel={viewModel}
                         inputRowWidth={Math.min(useResize(parent).width * .7, 700)}/>
        </div>

        <TopScrollShadow/>
        <BottomScrollShadow/>
    </div>);
};

export default ChatPage;