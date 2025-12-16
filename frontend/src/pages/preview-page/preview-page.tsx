// http://localhost:5173/documents/f4d24f2a-37fd-4343-8042-fea0e460c071


import {type FC, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import './preview-page.css'
import ChatContent from "../chat-page/chat-content.tsx";
import chatPageViewModel from "../chat-page/chat-page-vm.ts";

const PreviewPage: FC = () => {

    const {documentId} = useParams<{ documentId?: string }>();
    const [page, setPage] = useState<string | null>(null);

    const [chatId, setChatId] = useState<string | undefined>(undefined)



    useEffect(() => {
        // Извлекаем хеш из URL после загрузки компонента
        const hash = window.location.hash; // "#page=5"
        const pageMatch = hash.match(/page=(\d+)/);
        if (pageMatch) {
            setPage(pageMatch[1]);
        }
    }, []);
    const link = `http://localhost:8000/document/${documentId}#page=${page}`
    return (
        <div style={{overflow: "hidden"}}>

            <div className="preview-chat-container">
                <ChatContent chatId={chatId}  viewModel={chatPageViewModel(chatId, async (chatService) => {
                    if (!chatId) {
                        const chat = await chatService.createChat(documentId)
                        setChatId(chat.chatId)
                    }
                })} inputRowWidth={"100%"}/>
            </div>
            <div id="scroll-wrapper">
                <iframe
                    frameBorder="0"
                    className="preview-iframe"
                    allowFullScreen={true}
                    src={link}
                    width="100%"
                    height="100%"
                    title="PDF Viewer"
                >Browser not compatible =(
                </iframe>
            </div>
        </div>
    )
}

export default PreviewPage;