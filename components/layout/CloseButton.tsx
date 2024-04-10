'use client';

import { twJoin } from 'tailwind-merge';

type Props = {
	onClick?: () => void;
	className?: string;
	autoFocus?: boolean;
};
const CloseButton: React.FC<Props> = ({ onClick, className, autoFocus }) => {
	return (
		<button
			onClick={onClick}
			aria-label="Close Button"
			className={twJoin('cursor-pointer', className)}
			autoFocus={autoFocus}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 1024 1024" fill="currentColor">
				<path d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z" />
			</svg>
		</button>
	);
};

export default CloseButton;
