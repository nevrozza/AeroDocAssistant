import { colors } from "../utils/colors";
import type { Icon } from "../utils/icon";
import "./outlined-button.css"

interface OutlinedButtonProps {
    text: string;
    icon: Icon;
    blury?: boolean;
    onClick?: () => void;
}

const OutlinedButton = (props: OutlinedButtonProps) => (
    
    <button className="button-container" onClick={props.onClick} style={{backgroundColor: colors.background, borderColor: colors.containerHigh}}>
        <div className="icon">
            <props.icon size={18}></props.icon>
        </div>
        {props.text}
    </button>
);

export default OutlinedButton;