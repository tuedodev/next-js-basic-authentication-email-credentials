import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import { getSessionToken } from '@/lib/session';

type Props = {
	children: React.ReactNode;
};

const BaseLayout: React.FC<Props> = async ({ children }) => {
	const session = await getSessionToken();
	return (
		<div className="grid grid-cols-1 grid-rows-[auto_auto_1fr_auto] px-4 min-h-[100svh] xl:container xl:mx-auto">
			<Header />
			<Nav session={session} />
			{children}
			<Footer />
		</div>
	);
};

export default BaseLayout;
