// http://localhost:5173/documents/f4d24f2a-37fd-4343-8042-fea0e460c071


import {type FC, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {IconButton} from "../../widgets";
import {LuFile} from "react-icons/lu";
import './preview-page.css'

const PreviewPage: FC = () => {

    const {documentId} = useParams<{ documentId?: string }>();
    const [page, setPage] = useState<string | null>(null);

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
        <div>

            <div style={{position: "absolute", zIndex: 1000}}>
                <IconButton icon={LuFile}></IconButton>
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
                >Browser not compatible</iframe>
            </div>
        </div>
    )
}

export default PreviewPage;