'use client';

import { ElementRef, ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ClickButton from '../form/ClickButton';
import { useModal } from '../context/ModalProvider';

export type ButtonType = {
	id: string;
	label: string;
};
export type ModalContentProps = {
	modalContent: ReactNode | null;
	buttonIds?: ButtonType[];
	redirectionHandler?: () => Promise<string>;
	modalClickHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const INIT_MODAL_VALUES = {
	modalContent: null,
	modalClickHandler: (event: React.MouseEvent<HTMLButtonElement>) => {},
};

const ModalBuilder: React.FC<ModalContentProps> = ({
	modalContent,
	buttonIds,
	modalClickHandler,
	redirectionHandler,
}) => {
	const dialogRef = useRef<ElementRef<'dialog'>>(null);
	const router = useRouter();
	const { setShowModal, showModal } = useModal();

	useEffect(() => {
		if (showModal) {
			dialogRef.current?.showModal();
			if (typeof redirectionHandler === 'function') {
				redirectionHandler().then((redirectPath) => {
					dialogRef.current?.close();
					router.push(redirectPath);
				});
			}
		}
	}, [showModal, redirectionHandler, router]);

	return (
		<dialog
			id="modal"
			ref={dialogRef}
			className="fixed bg-slate-500 dark:bg-gray-700 inset-0 @sm:inset-2 @md:inset-[10%] @xl:inset-[20%] @5xl:max-w-[800px] font-sans p-6 space-y-4 text-white rounded-lg outline-none focus:ring-1 focus:ring-current"
		>
			{modalContent}
			{buttonIds ? (
				<div className="flex flex-wrap gap-x-4 w-full justify-between">
					{buttonIds.map((button, index) => {
						return (
							<ClickButton
								id={button.id}
								label={button.label}
								key={index}
								onClickHandler={(event: React.MouseEvent<HTMLButtonElement>) => {
									dialogRef?.current?.close();
									setShowModal(false);
									if (typeof modalClickHandler === 'function') {
										modalClickHandler(event);
									}
								}}
							/>
						);
					})}
				</div>
			) : null}
		</dialog>
	);
};

export default ModalBuilder;
