import { EMAIL_VERIFICATION_LINK_VALID_SECONDS } from '@/lib/constants';
import ModalProvider from '@/components/context/ModalProvider';
import ShowMessageModal from '@/components/layout/ShowMessageModal';
import { deleteUser, getUser, updateStatus } from '@/lib/databaseQueries';

export const dynamic = 'force-dynamic';
type Props = {
	searchParams: URLSearchParams;
};
const VerifyPage = async ({ searchParams }: Props) => {
	const searchParamsObject = new URLSearchParams(searchParams);
	const key = searchParamsObject.get('key') || '';
	const token = searchParamsObject.get('token') || '';
	let messages = [''];
	let redirectPath = '/auth/login';
	try {
		let result = await getUser(key, token, EMAIL_VERIFICATION_LINK_VALID_SECONDS);
		if (result.success) {
			const user = result.data;
			const modified = new Date(user.ModifiedDate);
			const delta = Math.floor((Date.now() - modified.getTime()) / 1000);
			if (delta > EMAIL_VERIFICATION_LINK_VALID_SECONDS) {
				const deleted = await deleteUser(user.id);
				if (deleted) {
					redirectPath = '/auth/register';
					throw 'Your Token expired. Please register again and confirm the password link in due time.';
				} else {
					throw 'Error: Token expired. Could not delete user. Please contact support.';
				}
			} else {
				const updateUser = await updateStatus(user.id, 'ACTIVE');
				if (updateUser.success) {
					messages = ['Your account has been successfully verified.', 'You will be redirected to login page.'];
				} else {
					throw 'Error: User verified, but could not update user status to active. Please contact support.';
				}
			}
		} else {
			throw `Error: ${result.error}`;
		}
	} catch (err) {
		messages = ['An error occured.', err as string];
	}

	return (
		<main className="grid grid-cols-[min(95%,_480px)] grid-rows-1 justify-center items-center px-4">
			<div className="w-full p-4 flex items-center justify-center">
				<ModalProvider>
					<ShowMessageModal title="Verification of your account" messages={messages} redirectPath={redirectPath} />
				</ModalProvider>
			</div>
		</main>
	);
};

export default VerifyPage;
