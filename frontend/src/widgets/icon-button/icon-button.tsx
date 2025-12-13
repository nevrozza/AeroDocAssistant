import type {CSSProperties, FC} from "react";
import * as React from "react";

import "./icon-button.css"
import {colors} from "../../widgets"


interface IconButtonProps {
    radius?: number,
    iconColor?: string,
    containerColor?: string,
    onClick?: () => void,
    icon: React.ComponentType<{ style?: CSSProperties, size?: string | number; color?: string; }>;
}

const IconButton: FC<IconButtonProps>
    = ({
           radius = 60,
           iconColor = colors.primary,
           containerColor = colors.containerHigh,
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
                    opacity:
                        (iconColor !== colors.onBackground ? "100%" : "70%")
                }
            }
            color={iconColor}
        />
    </button>

};


export default IconButton;