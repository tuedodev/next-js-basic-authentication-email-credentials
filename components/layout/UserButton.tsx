'use client';

import { useSession } from '@/components/context/SessionProvider';
import { useEffect, useRef, useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { useTheme } from '../context/ThemeProvider';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { DROPDOWN_MENU_DELAY } from '@/lib/constants';

type Props = {
	className?: string;
};

const UserButton: React.FC<Props> = ({ className }) => {
	const { session, isAuthenticated } = useSession();
	const { theme } = useTheme();
	const [hidden, setHidden] = useState(true);
	const timer = useRef<NodeJS.Timeout | null>(null);

	function onMouseEnterHandler() {
		if (hidden) {
			timer.current = setTimeout(() => {
				setHidden((prev) => false);
			}, DROPDOWN_MENU_DELAY);
		}
	}

	function onMouseLeaveHandler() {
		clearTimeout(timer.current as NodeJS.Timeout);
		setHidden((prev) => true);
	}

	function onClickHandler() {
		if (hidden) {
			setHidden((prev) => false);
		}
	}

	useEffect(() => {
		return () => {
			clearInterval(timer.current as NodeJS.Timeout);
			setHidden((prev) => true);
		};
	}, []);

	const styles = twJoin(
		className,
		theme === 'light' ? 'text-white bg-[#1C274C]' : 'text-black bg-slate-100',
		'opacity-85 hover:opacity-100 focus:opacity:100 transition-opacity duration-300 aspect-square rounded-full w-[48px] h-[48px] font-bold'
	);

	return (
		<div className="flex flex-col justify-center self-start px-2 py-2">
			{isAuthenticated ? (
				<div
					className="relative"
					onClick={onClickHandler}
					onMouseEnter={onMouseEnterHandler}
					onMouseLeave={onMouseLeaveHandler}
				>
					<Link href="/auth/settings">
						<button className={twJoin(styles, 'tracking-wider  text-lg')} aria-label="User Button">
							{`${session && session.firstname?.substring(0, 1).toUpperCase()}${
								session && session.lastname?.substring(0, 1).toUpperCase()
							}`}
						</button>
					</Link>
					<div
						id="dropdownHover"
						className="z-10 absolute top-[48px] right-0 bg-gray-700 divide-y divide-gray-100 rounded-lg shadow w-44"
					>
						<ul
							className={twMerge('py-2 text-sm text-gray-200', hidden ? 'hidden' : '')}
							aria-labelledby="dropdownHoverButton"
						>
							{session && session.role === 'ADMIN' && (
								<li>
									<Link
										className="block px-4 py-2 hover:bg-gray-600 hover:text-white"
										href="/auth/admin"
										onClick={() => onMouseLeaveHandler()}
									>
										Admin Area
									</Link>
								</li>
							)}
							<li>
								<Link
									className="block px-4 py-2 hover:bg-gray-600 hover:text-white"
									href="/auth/settings"
									onClick={() => onMouseLeaveHandler()}
								>
									Settings
								</Link>
							</li>
							<li>
								<LogoutButton
									onClickHandler={onMouseLeaveHandler}
									className="inline-block text-left w-full px-4 py-2 hover:bg-gray-600 hover:text-white"
								/>
							</li>
						</ul>
					</div>
				</div>
			) : (
				<Link
					className={twJoin(styles, 'inline-flex items-center justify-center text-sm uppercase')}
					href="/auth/login"
				>
					Login
				</Link>
			)}
		</div>
	);
};

export default UserButton;
