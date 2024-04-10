'use client';

import { twMerge } from 'tailwind-merge';

type Props = {
	id: string;
	label: string;
	onClickHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
	className?: string;
};

const ClickButton: React.FC<Props> = ({ label, className, id, onClickHandler }) => {
	return (
		<button
			type="button"
			id={id}
			onClick={onClickHandler}
			className={twMerge(
				'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mt-4',
				className
			)}
		>
			{label}
		</button>
	);
};

export default ClickButton;
