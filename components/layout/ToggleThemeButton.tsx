'use client';

import { clientUpdatesThemeCookie } from '@/lib/session';
import { twJoin } from 'tailwind-merge';
import { useTheme } from '../context/ThemeProvider';

type Props = {
	className?: string;
};
const ToggleThemeButton: React.FC<Props> = ({ className }) => {
	const { theme, setTheme } = useTheme();

	return (
		<button
			className={twJoin(
				className,
				'px-2 py-2 opacity-85 hover:opacity-100 focus:opacity:100 transition-opacity duration-300',
				theme === 'light' ? 'text-black py-2' : 'text-white py-2'
			)}
			onClick={async () => {
				const newTheme = theme === 'light' ? 'dark' : 'light';
				if (typeof document !== 'undefined') {
					document.documentElement.dataset.theme = newTheme;
				}
				setTheme((_) => newTheme);
				await clientUpdatesThemeCookie(newTheme);
			}}
			aria-label="Toggle between light dark mode"
		>
			{theme === 'light' ? <MoonIcon /> : <SunIcon />}
		</button>
	);
};

export default ToggleThemeButton;

const SunIcon = () => {
	return (
		<svg fill="currentColor" width="48px" height="48px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
			<g id="SVGRepo_iconCarrier">
				{' '}
				<g>
					{' '}
					<g>
						{' '}
						<rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"></rect>{' '}
						<path d="M12 6a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1z"></path>{' '}
						<path d="M21 11h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2z"></path>{' '}
						<path d="M6 12a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1z"></path>{' '}
						<path d="M6.22 5a1 1 0 0 0-1.39 1.47l1.44 1.39a1 1 0 0 0 .73.28 1 1 0 0 0 .72-.31 1 1 0 0 0 0-1.41z"></path>{' '}
						<path d="M17 8.14a1 1 0 0 0 .69-.28l1.44-1.39A1 1 0 0 0 17.78 5l-1.44 1.42a1 1 0 0 0 0 1.41 1 1 0 0 0 .66.31z"></path>{' '}
						<path d="M12 18a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1z"></path>{' '}
						<path d="M17.73 16.14a1 1 0 0 0-1.39 1.44L17.78 19a1 1 0 0 0 .69.28 1 1 0 0 0 .72-.3 1 1 0 0 0 0-1.42z"></path>{' '}
						<path d="M6.27 16.14l-1.44 1.39a1 1 0 0 0 0 1.42 1 1 0 0 0 .72.3 1 1 0 0 0 .67-.25l1.44-1.39a1 1 0 0 0-1.39-1.44z"></path>{' '}
						<path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4z"></path>{' '}
					</g>{' '}
				</g>{' '}
			</g>
			<title>Toggle to Light Mode</title>
		</svg>
	);
};
const MoonIcon = () => {
	return (
		<svg width="48px" height="48px" viewBox="0 0 24.00 24.00" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g
				id="SVGRepo_tracerCarrier"
				strokeLinecap="round"
				strokeLinejoin="round"
				stroke="#CCCCCC"
				strokeWidth="0.096"
			></g>
			<g id="SVGRepo_iconCarrier">
				{' '}
				<path
					d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
					fill="#1C274C"
				></path>{' '}
			</g>
			<title>Toggle to Dark Mode</title>
		</svg>
	);
};
