'use client';

import { twMerge } from 'tailwind-merge';
import { useFormStatus } from 'react-dom';
import { useForm } from '../context/FormProvider';

type Props = {
	label: string;
	className?: string;
};

const SubmitButton: React.FC<Props> = ({ label, className }) => {
	const { pending } = useFormStatus();
	const { isChanged } = useForm();
	const disabled = pending ? pending : !isChanged;

	return (
		<button
			type="submit"
			disabled={disabled}
			className={twMerge(
				'bg-gradient-to-r focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mt-4',
				className,
				disabled
					? 'cursor-not-allowed text-gray-300 from-blue-500/70 via-blue-600/70 to-blue-700/70'
					: 'from-blue-500 via-blue-600 to-blue-700 cursor-pointer text-white hover:bg-gradient-to-br'
			)}
		>
			{label}
		</button>
	);
};

export default SubmitButton;
