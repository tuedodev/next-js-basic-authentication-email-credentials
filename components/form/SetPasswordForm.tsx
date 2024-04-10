'use client';

import { logoutAction, resetPasswordAction } from '@/lib/session';
import { resetPasswordSchema } from '@/lib/validation';
import React, { useRef } from 'react';
import FormProvider from '../context/FormProvider';
import ModalProvider from '../context/ModalProvider';
import FormError from './FormError';
import PasswordField from './PasswordField';
import HiddenField from './HiddenField';
import PasswordResetSuccessModal from '../fragments/PasswordResetSuccessModal';
import { useRouter } from 'next/navigation';
import SubmitButton from './SubmitButton';

const MODAL_VALUES = {
	modalContent: (
		<>
			<h2>Your password was succesfully reset.</h2>
			<p>You need to login again.</p>
		</>
	),
};
type Props = {
	payload: string;
};
const SetPasswordForm: React.FC<Props> = ({ payload }) => {
	const passwordRef = useRef<HTMLInputElement[]>([]);
	const router = useRouter();

	const modalClickHandler = async () => {
		/*return new Promise<void>(async (resolve) => {
			await logoutAction();
			resolve();
		}).then(() => {
			router.push('/auth/login');
		});*/
		await logoutAction();
		router.push('/auth/login');
	};

	return (
		<ModalProvider>
			<FormProvider
				dispatcher={resetPasswordAction}
				schema={resetPasswordSchema}
				passwordRefs={passwordRef}
				initValues={{ payload, password: '', confirmPassword: '' }}
				modal={{
					modalContent: <PasswordResetSuccessModal />,
					modalClickHandler,
					buttonIds: [{ id: 'confirm', label: 'Okay' }],
				}}
			>
				<FormError />
				<HiddenField name={'payload'} value={payload} />
				<PasswordField
					name="password"
					label="Password"
					autoComplete="current-password"
					ref={(el) => {
						if (el) {
							passwordRef?.current?.push(el);
						}
					}}
				/>
				<PasswordField
					name="confirmPassword"
					label="Confirm Password"
					autoComplete="new-password"
					ref={(el) => {
						if (el) {
							passwordRef?.current?.push(el);
						}
					}}
				/>
				<SubmitButton label="Reset Password" className="mb-4" />
			</FormProvider>
		</ModalProvider>
	);
};

export default SetPasswordForm;
