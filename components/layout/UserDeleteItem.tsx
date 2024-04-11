'use client';

import { useModal } from '../context/ModalProvider';
import AdminDeleteUserConfirmation from '../fragments/AdminDeleteUserConfirmation';
import Delete from '../icons/Delete';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Symbol from '@/components/icons/Symbol';
import { twMerge } from 'tailwind-merge';
import { STATUS_TAILWIND_BG_COLORS } from '@/lib/constants';
import MessageModal from '../fragments/MessageModal';
import { UserResult } from '@/lib/types';

type Props = {
	fields: string[];
	id: number;
	role: string;
	status: string;
	deleteUser: () => void;
};
const UserDeleteItem: React.FC<Props> = ({ fields, id, role, status, deleteUser }) => {
	const { setContent, setShowModal, closeModal } = useModal();
	const router = useRouter();

	function deleteHandler() {
		setContent({
			modalContent:
				role === 'ADMIN' ? (
					<MessageModal
						title="Error: Not allowed"
						messages={['An admin cannot delete another admin.', ' Please downgrade the user first.']}
					/>
				) : (
					<AdminDeleteUserConfirmation firstname={fields[1]} lastname={fields[2]} email={fields[0]} id={id} />
				),
			buttonIds:
				role === 'ADMIN'
					? [{ id: 'confirm', label: 'Okay' }]
					: [
							{ id: 'confirm', label: 'Confirm' },
							{ id: 'cancel', label: 'Cancel' },
					  ],
			modalClickHandler:
				role === 'ADMIN'
					? async () => {
							closeModal();
							router.push('/auth/admin?refresh=1');
							return;
					  }
					: async (event: React.MouseEvent<HTMLButtonElement>) => {
							if (event.currentTarget.id === 'confirm') {
								try {
									deleteUser();
									closeModal();
									router.push('/auth/admin?refresh=2');
								} catch (err) {
									alert('Could not delete user');
								}
							} else {
								closeModal();
							}
					  },
		});
		setShowModal(true);
	}
	return (
		<li className="flex items-center my-1">
			<Delete
				className={twMerge('w-6 h-6 mr-1', role === 'ADMIN' ? 'text-gray-600 hover:cursor-not-allowed' : '')}
				onClickHandler={role !== 'ADMIN' ? deleteHandler : undefined}
			/>
			<Symbol
				title={role}
				label={role.charAt(0).toUpperCase()}
				className={role === 'ADMIN' ? 'bg-gray-700' : 'bg-gray-700/75'}
			/>
			<Symbol
				title={status}
				label={status.slice(0, 3).toUpperCase()}
				className={`text-[0.6rem] text-white ${STATUS_TAILWIND_BG_COLORS[status]}`}
			/>
			<Link
				href={`/auth/settings?userid=${id}`}
				className="flex-1 flex py-2 px-2 rounded-md bg-gray-700/75 hover:bg-gray-700"
			>
				{fields?.length > 0 &&
					fields?.map((field, index) => {
						return (
							<p key={index} className="flex-1 text-white text-xs break-all whitespace-normal">
								{field}
							</p>
						);
					})}
			</Link>
		</li>
	);
};

export default UserDeleteItem;
