import type {FC} from "react";

import "./icon-button.css"
import {colors, type Icon} from "../../widgets"


interface IconButtonProps {
    radius?: number,
    iconColor?: string,
    containerColor?: string,
    opacity?: number,
    onClick?: () => void,
    icon: Icon;
}

const IconButton: FC<IconButtonProps>
    = ({
           radius = 60,
           iconColor = colors.onBackground,
           containerColor = colors.containerHigh,
           opacity = iconColor !== colors.onBackground ? 1 : .7,
           onClick = () => null,
           icon: Icon
       }) => {
    const iconSize = radius - 20;

    return <button className="container hoverable clickable"
                   style={{width: radius, height: radius, backgroundColor: containerColor}}
                   onClick={onClick}
    >
        <Icon
            style={
                {
                    height: iconSize, width:
                    iconSize,
                    opacity: opacity,
                }
            }
            color={iconColor}
        />
    </button>

};


export default IconButton;