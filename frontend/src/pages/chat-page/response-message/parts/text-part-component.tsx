import type {ITextPart} from "./parts.ts";
import './part-component.css'
import type {FC} from "react";

interface TextPartComponentProps {
    part: ITextPart
}

const TextPartComponent: FC<TextPartComponentProps> = ({part}) => (
    <div className="text-part">{part.text}</div>
);

export default TextPartComponent;