type Props = {
	name: string;
	value: string;
};
const HiddenField: React.FC<Props> = ({ name, value }) => {
	return <input type="hidden" name={name} id={name} value={value} />;
};

export default HiddenField;
