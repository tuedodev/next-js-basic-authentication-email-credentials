'use client';

import { logoutAction } from '@/lib/session';
import { useRouter, usePathname } from 'next/navigation';

type Props = {
	className?: string;
	onClickHandler?: () => void;
};

const LogoutButton: React.FC<Props> = ({ className, onClickHandler }) => {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<button
			className={className}
			onClick={async () => {
				if (typeof onClickHandler === 'function') {
					onClickHandler();
				}
				await logoutAction();
				let newPath = '/';
				if (pathname.startsWith('/auth')) {
					newPath = '/auth/login';
				}
				router.push(newPath);
			}}
		>
			Logout
		</button>
	);
};

export default LogoutButton;
