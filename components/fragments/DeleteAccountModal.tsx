'use client';

import { deleteAccount, logoutAction } from '@/lib/session';
import FormProvider from '../context/FormProvider';
import InputField from '../form/InputField';
import { deleteAccountSchema } from '@/lib/validation';
import HiddenField from '../form/HiddenField';
import { useRouter } from 'next/navigation';
import SubmitButton from '../form/SubmitButton';
import ClickButton from '../form/ClickButton';
import { useModal } from '../context/ModalProvider';
import MessageModal from './MessageModal';

type Props = {
	payload: string;
};

const DeleteAccountModal: React.FC<Props> = ({ payload }) => {
	const router = useRouter();
	const { closeModal } = useModal();
	function modalClickHandler() {
		logoutAction('/auth/settings').then(() => {
			router.push('/');
		});
	}
	return (
		<>
			<h2 className="font-bold text-2xl border-b-4 border-slate-700/80 pb-2 mb-4">Danger Zone</h2>
			<p>Do you really want to delete your account?</p>
			<p>Please keep in mind that this cannot be undone.</p>
			<p>In order to delete your account please enter DELETE in below textfield and confirm.</p>
			<FormProvider
				dispatcher={deleteAccount}
				schema={deleteAccountSchema}
				initValues={{ delete: '' }}
				modal={{
					modalContent: <MessageModal title="Account deleted" messages={['You will be redirected to the Homepage.']} />,
					modalClickHandler,
					buttonIds: [{ id: 'confirm', label: 'Okay' }],
				}}
			>
				<HiddenField name="payload" value={payload} />
				<InputField name="delete" label="Please enter DELETE" />
				<div className="flex w-full justify-between">
					<SubmitButton label="Delete" />
					<ClickButton id="cancel" label="Cancel" onClickHandler={closeModal} />
				</div>
			</FormProvider>
		</>
	);
};

export default DeleteAccountModal;
