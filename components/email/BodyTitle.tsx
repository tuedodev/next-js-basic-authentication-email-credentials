type Props = {
	firstname: string;
	lastname: string;
};
const BodyTitle: React.FC<Props> = ({ firstname, lastname }) => {
	return (
		<p>
			Dear {firstname} {lastname},
		</p>
	);
};

export default BodyTitle;
