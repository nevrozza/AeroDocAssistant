import {colors} from "../utils/colors";
import type {Icon} from "../utils/icon";
import "./outlined-button.css"

interface OutlinedButtonProps {
    text: string;
    containerColor?: string;
    color?: string;
    icon?: Icon;
    blury?: boolean;
    onClick?: () => void;
}

const OutlinedButton = ({
                            text,
                            containerColor = colors.background,
                            color = colors.onBackground,
                            icon: Icon,
                            blury = false, // TODO
                            onClick = () => null,
                        }: OutlinedButtonProps) => (

    <button className="button-container hoverable clickable"
            onClick={onClick}
            style={{backgroundColor: containerColor, color: color, borderColor: colors.containerHighest}}
    >
        {Icon && (
            <Icon size={18}/>
        )}
        {text}
    </button>
);

export default OutlinedButton;