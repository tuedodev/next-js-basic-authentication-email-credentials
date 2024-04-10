'use client';

import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { INIT_MODAL_VALUES, ModalContentProps } from '../layout/ModalBuilder';
import ModalBuilder from '../layout/ModalBuilder';

type ModalContextType = {
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	setContent: React.Dispatch<React.SetStateAction<ModalContentProps>>;
	closeModal: () => void;
};

type Props = {
	children: React.ReactNode;
};

const ModalContext = createContext<ModalContextType | null>(null);

const ModalProvider: React.FC<Props> = ({ children }) => {
	const [showModal, setShowModal] = useState(false);
	const [content, setContent] = useState<ModalContentProps>(INIT_MODAL_VALUES);
	const router = useRouter();

	function closeModal() {
		setShowModal(false);
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}

	return (
		<ModalContext.Provider value={{ showModal, setShowModal, setContent, closeModal }}>
			{children}
			{showModal && createPortal(<ModalBuilder {...content} />, document.body)}
		</ModalContext.Provider>
	);
};

export function useModal() {
	const context = useContext(ModalContext);
	if (!context) throw new Error('useModalhook has to be used within a ModalProvider.');
	return context;
}
export default ModalProvider;
