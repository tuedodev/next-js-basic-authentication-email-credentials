type Props = {
	message: string[];
};
const BodyMessage: React.FC<Props> = ({ message }) => {
	return (
		<>
			{message.map((paragraph, index) => (
				<p key={index}>{paragraph}</p>
			))}
		</>
	);
};

export default BodyMessage;
