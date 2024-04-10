'use client';

import React, { useEffect } from 'react';
import { useModal } from '../context/ModalProvider';
import { useRouter } from 'next/navigation';
import MessageModal from '../fragments/MessageModal';

type Props = {
	title: string;
	messages: string[];
	redirectPath: string;
};
const ShowMessageModal: React.FC<Props> = ({ title, messages, redirectPath }) => {
	const { setContent, setShowModal } = useModal();
	const router = useRouter();

	useEffect(() => {
		const modal = {
			modalContent: <MessageModal title={title} messages={messages} />,
			modalClickHandler: () => {
				router.push(redirectPath);
			},
			buttonIds: [{ id: 'confirm', label: 'Okay' }],
		};
		setContent(modal);
		setShowModal(true);
	}, [setContent, setShowModal, router, redirectPath, messages, title]);
	return null;
};

export default ShowMessageModal;
