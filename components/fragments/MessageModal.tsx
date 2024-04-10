'use client';

type Props = {
	title: string;
	messages: string[];
};

const MessageModal: React.FC<Props> = ({ title, messages }) => {
	return (
		<>
			<h2 className="font-bold text-2xl border-b-4 border-slate-700/80 pb-2 mb-4">{title}</h2>
			{messages.map((message, index) => (
				<p key={index}>{message}</p>
			))}
		</>
	);
};

export default MessageModal;
