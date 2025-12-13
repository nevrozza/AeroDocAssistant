
// TODO
interface IconButtonProps {
    icon: null;
    radius: null,
    onClick?: () => void;
}

const IconButton = (props: IconButtonProps) => (
    <div>
        <p>
            {props.icon}
        </p>
    </div>
);

export default IconButton;