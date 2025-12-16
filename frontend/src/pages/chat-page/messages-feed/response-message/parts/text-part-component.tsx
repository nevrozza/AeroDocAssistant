import type {ITextPart} from "./parts.ts";
import './text-part.css'
import type {FC} from "react";
import Markdown from "react-markdown";

interface TextPartComponentProps {
    part: ITextPart
}

const TextPartComponent: FC<TextPartComponentProps> = ({part}) => (
    <div className="text-part">
        <Markdown skipHtml={true}>{part.text}</Markdown>
    </div>
);

export default TextPartComponent;