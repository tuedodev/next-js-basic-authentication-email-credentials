import ToggleThemeButton from './ToggleThemeButton';
import { twJoin } from 'tailwind-merge';
import UserButton from './UserButton';

type Props = {
	className?: string;
};
const Header: React.FC<Props> = ({ className }) => {
	return (
		<div className={twJoin(className, 'flex')}>
			<ToggleThemeButton className="flex-0 self-start" />
			<h1 className="text-xl md:text-3xl flex-1 font-mono font-bold underline decoration-3 text-center py-2">
				Next JS Basic Authentication Email Credentials
			</h1>
			<UserButton />
		</div>
	);
};

export default Header;
