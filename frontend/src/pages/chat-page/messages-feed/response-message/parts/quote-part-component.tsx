import type {IQuotePart} from "./parts.ts";
import './part-component.css'
import type {FC} from "react";
import Markdown from "react-markdown";

interface QuotePartComponentProps {
    part: IQuotePart
}

const QuotePartComponent: FC<QuotePartComponentProps> = ({part}) => (
    <div className="quote-part">
        <Markdown skipHtml={true}>{part.quote}</Markdown>
    </div>
);

export default QuotePartComponent;