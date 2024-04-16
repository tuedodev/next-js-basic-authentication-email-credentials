import UserDeleteList from '@/components/layout/UserDeleteList';
import { getAllUsers } from '@/lib/databaseQueries';

export const dynamic = 'force-dynamic';

const Adminpage = async () => {
	const allUsers = await getAllUsers('');

	return (
		<div className="grid grid-cols-1 grid-rows-1 px-4">
			<div className="w-full">
				<h2 className="font-bold text-2xl border-b-4 border-slate-700/80 pb-2 mb-4">Admin Area</h2>
				<UserDeleteList allUsers={allUsers} />
			</div>
		</div>
	);
};

export default Adminpage;
