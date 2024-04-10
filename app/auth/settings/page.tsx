import SettingsForm from '@/components/form/SettingsForm';
import { encryptIdEmail } from '@/lib/utils';
import SettingsFormAdmin from '@/components/form/SettingsFormAdmin';
import { getSessionUserFromDB, getUserById } from '@/lib/databaseQueries';
import { getSessionToken } from '@/lib/session';

/* Prisma ORM doesn´t allow to just omit sensitive fields with exclude
https://github.com/prisma/prisma/issues/5042
*/
type Props = {
	searchParams: URLSearchParams;
};

const SettingPage = async ({ searchParams }: Props) => {
	const session = await getSessionToken();
	let { user, payload } = await getSessionUserFromDB(session);
	let isAdmin = false;

	const searchParamsObject = new URLSearchParams(searchParams);
	const userid = searchParamsObject.get('userid');

	if (userid) {
		if (user?.role.name === 'ADMIN') {
			const userSetting = await getUserById(userid);
			isAdmin = true;
			if (userSetting) {
				payload = await encryptIdEmail({ id: userSetting.id, email: userSetting.email });
				user = { ...userSetting, role: { id: userSetting.roleId, name: userSetting.role.name } };
			} else {
				console.log('User not found in DB.');
			}
		} else {
			console.log('Unauthorized access.');
		}
	}

	return (
		<main className="grid grid-cols-[min(95%,_480px)] grid-rows-1 justify-center items-center px-4">
			{user && (
				<div className="w-full rounded-lg ring-2 ring-slate-700/40 focus-within:ring-slate-700/80 p-2">
					<h2 className="font-bold text-2xl border-b-4 border-slate-700/80 pb-2 mb-4">Settings</h2>
					{isAdmin ? (
						<SettingsFormAdmin user={{ ...user, payload: payload || '' }} />
					) : (
						<SettingsForm user={{ ...user, payload: payload || '' }} />
					)}
				</div>
			)}
		</main>
	);
};

export default SettingPage;
