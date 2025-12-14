import './my-message.css'
import {colors} from "../utils/colors.ts";

interface MyMessageProps {
    text: string;
    containerColor?: string;
}

const MyMessage = ({
                            text,
                            containerColor = colors.containerHigh,
                        }: MyMessageProps) => (
    <div className="my-message-container" style={{backgroundColor: containerColor}}>
        {text}
    </div>
);

export default MyMessage;