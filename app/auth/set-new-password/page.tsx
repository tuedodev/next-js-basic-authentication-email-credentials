import ModalProvider from '@/components/context/ModalProvider';
import SetPasswordForm from '@/components/form/SetPasswordForm';
import ShowMessageModal from '@/components/layout/ShowMessageModal';
import { EMAIL_PASSWORD_RESET_LINK_VALID_SECONDS } from '@/lib/constants';
import { getUser } from '@/lib/databaseQueries';
import { encryptIdEmail } from '@/lib/utils';
import React from 'react';

type Props = {
	searchParams: URLSearchParams;
};
const SetNewPasswordPage = async ({ searchParams }: Props) => {
	const searchParamsObject = new URLSearchParams(searchParams);
	const key = searchParamsObject.get('key') || '';
	const token = searchParamsObject.get('token') || '';
	const result = await getUser(key, token, EMAIL_PASSWORD_RESET_LINK_VALID_SECONDS);
	const payload = result.success ? await encryptIdEmail({ id: result.data.id, email: result.data.email }) : 'error';

	return (
		<main className="grid grid-cols-[min(95%,_480px)] grid-rows-1 justify-center items-center px-4">
			<div className="w-full rounded-lg ring-2 ring-slate-700/40 focus-within:ring-slate-700/80 p-2">
				<h2 className="font-bold text-2xl border-b-4 border-slate-700/80 pb-2 mb-4">Set New Password</h2>
				{result.success && <SetPasswordForm payload={payload} />}
				{!result.success && (
					<ModalProvider>
						<ShowMessageModal
							title="Password Reset Error"
							messages={['An error occured.', result.error, 'You will be redirected to homepage.']}
							redirectPath={'/'}
						/>
					</ModalProvider>
				)}
			</div>
		</main>
	);
};

export default SetNewPasswordPage;
