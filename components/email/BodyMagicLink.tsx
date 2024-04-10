type Props = {
	magicLink: string;
	validityInSeconds?: number;
};
const BodyMagicLink: React.FC<Props> = ({ magicLink, validityInSeconds }) => {
	return (
		<>
			<a className="bg-blue-500 py-2 px-4 rounded-lg text-3xl" href={magicLink}>
				Link
			</a>
			<p>If the link does not work, please use the following string as URL in your browser:</p>
			<p className="text-center text-sm">{magicLink}</p>
			{validityInSeconds && <p>This link is valid for {Math.floor(validityInSeconds / 60)} minutes.</p>}
		</>
	);
};

export default BodyMagicLink;
