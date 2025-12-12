// TODO

interface TextFieldProps {
    value: string;
    onChange: (value: string) => void;
    trailingIcon: null
}

const TextField = (props: TextFieldProps) => (
    <div> {props.trailingIcon}</div>
);

export default TextField;