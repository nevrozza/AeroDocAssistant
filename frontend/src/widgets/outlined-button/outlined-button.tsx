// TODO

interface OutlinedButtonProps {
    text: string;
    icon: string;
    isGlass?: boolean;
    onClick?: () => void;
}

const OutlinedButton = (props: OutlinedButtonProps) => (
    <div> {props.icon}</div>
);

export default OutlinedButton;