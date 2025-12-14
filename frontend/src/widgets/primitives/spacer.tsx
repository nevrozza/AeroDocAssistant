import type {FC} from "react";

export interface SpacerProps {
    height?: string | number,
    width?: string | number
}

const Spacer: FC<SpacerProps> = ({height = 0, width = 0}) => (
    <div style={{height: height, width: width}}/>
);

export default Spacer;