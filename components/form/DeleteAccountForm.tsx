'use client';

import { useEffect } from 'react';
import { useModal } from '../context/ModalProvider';
import DeleteAccountModal from '../fragments/DeleteAccountModal';

type Props = {
	payload: string;
};
const DeleteAccountForm: React.FC<Props> = ({ payload }) => {
	const { setContent, setShowModal } = useModal();

	useEffect(() => {
		setContent({
			modalContent: <DeleteAccountModal payload={payload} />,
		});
	}, [setContent, payload]);

	return (
		<div className="bg-red-500 p-2 rounded-lg text-center">
			<h3 className="font-bold mb-2 text-center underline">Danger Zone: Delete Account</h3>
			<button
				onClick={() => setShowModal(true)}
				className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 my-4"
			>
				Delete Account
			</button>
		</div>
	);
};

export default DeleteAccountForm;
