'use client';

import React, { useRef } from 'react';
import FormProvider from '../context/FormProvider';
import InputField from './InputField';
import { passwordForgotAction } from '@/lib/session';
import { emailSchema } from '@/lib/validation';
import FormError from './FormError';
import ModalProvider from '../context/ModalProvider';
import { useRouter } from 'next/navigation';
import PasswordResetLinkModal from '../fragments/PasswordResetLinkModal';
import SubmitButton from './SubmitButton';

const EmailForm = () => {
	const passwordRef = useRef<HTMLInputElement[]>([]);
	const router = useRouter();
	const modalClickHandler = () => {
		router.push('/');
	};
	return (
		<ModalProvider>
			<FormProvider
				dispatcher={passwordForgotAction}
				schema={emailSchema}
				initValues={{ email: '' }}
				modal={{
					modalContent: <PasswordResetLinkModal />,
					modalClickHandler,
					buttonIds: [{ id: 'confirm', label: 'Okay' }],
				}}
			>
				<FormError />
				<InputField name="email" label="Email" />
				<SubmitButton label="Get Password Link" className="mb-4" />
			</FormProvider>
		</ModalProvider>
	);
};

export default EmailForm;
