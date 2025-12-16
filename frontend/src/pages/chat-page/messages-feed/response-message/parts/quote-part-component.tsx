import type {IQuotePart} from "./parts.ts";
import './text-part.css'
import './quote-part.css'
import type {FC} from "react";
import Markdown from "react-markdown";
import {useState, useRef} from "react";
import {colors, IconButton} from "../../../../../widgets";
import {LuFile} from "react-icons/lu";

interface QuotePartComponentProps {
    part: IQuotePart
    num: number
}

const QuotePartComponent: FC<QuotePartComponentProps> = ({part, num}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);


    const expandedRef = useRef<HTMLDivElement>(null);
    const collapsedRef = useRef<HTMLButtonElement>(null);

    const toggleExpanded = () => {
        if (isAnimating) return;

        setIsAnimating(true);

        if (!isExpanded) {
            // Collapse -> expand
            collapsedRef.current?.classList.add('hiding');
            setTimeout(() => {
                setIsExpanded(true);
                setTimeout(() => {
                    setIsAnimating(false);
                }, 100);
            }, 300); // css
        } else {
            // expand -> collapse
            expandedRef.current?.classList.add('hiding');
            setTimeout(() => {
                setIsExpanded(false);
                setTimeout(() => {
                    setIsAnimating(false);
                }, 100);
            }, 300);
        }
    };

    return (
        <div className="quote-part">
            {!isExpanded ? (
                <button
                    ref={collapsedRef}
                    className="quote-part-collapsed"
                    onClick={toggleExpanded}
                    aria-expanded={false}
                    disabled={isAnimating}
                >
                    Цитата #{num}
                    <span style={{ // TODO
                        float: 'right',
                        transition: 'transform 0.3s ease',
                        transform: 'rotate(0deg)',
                        display: 'inline-block'
                    }}>▼</span>
                </button>
            ) : (
                <div
                    ref={expandedRef}
                    className="quote-part-expanded"
                >
                    <div className="quote-part-header">
                        {`${num}. ${part.documentTitle ? part.documentTitle : ""}`}
                        <button
                            onClick={toggleExpanded}
                            className="quote-part-close"
                            aria-label="Свернуть цитату"
                            disabled={isAnimating}
                        >
                            ×
                        </button>
                    </div>
                    <div className="quote-part-content">
                        <Markdown skipHtml={true}>{part.quote.trim()}</Markdown>
                    </div>

                    {part.fragment != null ? <div className="quote-part-file">
                        <IconButton icon={LuFile} containerColor={colors.primaryContainer}
                                    iconColor={colors.onPrimaryContainer} iconSize={24}
                                    border="1px dashed var(--primary)" onClick={() => {
                            window.open(`/documents/${part.fragment!!.documentId}#page=${part.fragment!!.documentPage}`, '_blank')?.focus()
                        }}/>
                    </div> : <></>}
                </div>
            )}
        </div>
    );
};

export default QuotePartComponent;