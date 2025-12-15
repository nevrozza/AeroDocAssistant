import type {FC} from "react";

export interface SpacerProps {
    height?: string | number,
    width?: string | number
}

const Spacer: FC<SpacerProps> = ({height = 0, width = 0}) => (
    <div style={{flexShrink: 0, height: height, width: width, transition: "height 600ms, width 600ms"}}/>
);

export default Spacer;