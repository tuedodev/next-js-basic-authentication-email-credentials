import { twMerge } from 'tailwind-merge';

type Props = {
	onClickHandler?: () => void;
	className?: string;
};
const Delete: React.FC<Props> = ({ className, onClickHandler }) => {
	return (
		<div className={className}>
			<svg
				className={twMerge(
					'w-8 h-8 flex-0 text-red-400 hover:text-red-700 flex-0 mr-2',
					onClickHandler ? 'hover:cursor-pointer' : '',
					className
				)}
				onClick={onClickHandler}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				width="100%"
				height="100%"
			>
				<path
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>
		</div>
	);
};

export default Delete;
