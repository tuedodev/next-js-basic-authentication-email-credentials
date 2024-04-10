import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { SessionType } from '@/lib/types';
import { isValidUser } from '@/lib/utils';
import LogoutButton from './LogoutButton';

type Props = {
	session: SessionType;
	className?: string;
};
const Nav: React.FC<Props> = ({ className, session }) => {
	const isAuthenticated = isValidUser(session);
	return (
		<nav className={twMerge('bg-transparent py-3 flex items-left flex-wrap', className)}>
			<Link className="text-sm px-4 py-2 leading-none rounded-full hover:bg-gray-700" href="/">
				Home
			</Link>
			<Link className="text-sm px-4 py-2 leading-none rounded-full hover:bg-gray-700" href="/authentication">
				Authentication
			</Link>
			<Link className="text-sm px-4 py-2 leading-none rounded-full hover:bg-gray-700" href="/authorization">
				Authorization
			</Link>
			{isAuthenticated && session?.role === 'ADMIN' ? (
				<Link className="text-sm px-4 py-2 leading-none rounded-full hover:bg-gray-700" href="/auth/admin">
					Admin
				</Link>
			) : null}
			{isAuthenticated && (
				<Link className="text-sm px-4 py-2 leading-none rounded-full hover:bg-gray-700" href="/auth/settings">
					Settings
				</Link>
			)}
			{isAuthenticated && <LogoutButton className="text-sm px-4 py-2 leading-none rounded-full hover:bg-gray-700" />}
		</nav>
	);
};

export default Nav;
