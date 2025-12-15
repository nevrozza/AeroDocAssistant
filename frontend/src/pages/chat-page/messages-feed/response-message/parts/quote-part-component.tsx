import type {IQuotePart} from "./parts.ts";
import './part-component.css'
import type {FC} from "react";

interface QuotePartComponentProps {
    part: IQuotePart
}

const QuotePartComponent: FC<QuotePartComponentProps> = ({part}) => (
    <div className="quote-part">
        {part.quote}
    </div>
);

export default QuotePartComponent;