import { twMerge } from 'tailwind-merge';

type Props = {
	title: string;
	label: string;
	className?: string;
};
const Symbol: React.FC<Props> = ({ title, label, className }) => {
	return (
		<div
			className={twMerge(
				'w-6 h-6 mr-1 rounded-full flex flex-col justify-center items-center px-2 py-2 text-lg font-bold',
				className
			)}
			title={title}
		>
			<span className="tracking-wider">{label}</span>
		</div>
	);
};

export default Symbol;
