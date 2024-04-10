'use client';

import React, { useRef } from 'react';
import FormProvider from '../context/FormProvider';
import PasswordField from './PasswordField';
import InputField from './InputField';
import { registerAction } from '@/lib/session';
import { registrationSchema } from '@/lib/validation';
import FormError from './FormError';
import ModalProvider from '../context/ModalProvider';
import { useRouter } from 'next/navigation';
import RegistrationModal from '../fragments/RegistrationModal';
import SubmitButton from './SubmitButton';

const RegisterForm = () => {
	const passwordRef = useRef<HTMLInputElement[]>([]);
	const router = useRouter();

	const modalClickHandler = () => {
		router.push('/auth/login');
	};

	return (
		<ModalProvider>
			<FormProvider
				dispatcher={registerAction}
				schema={registrationSchema}
				passwordRefs={passwordRef}
				initValues={{ firstname: '', lastname: '', email: '', password: '', confirmPassword: '' }}
				modal={{
					modalContent: <RegistrationModal />,
					modalClickHandler,
					buttonIds: [{ id: 'confirm', label: 'Okay' }],
				}}
			>
				<FormError />
				<InputField name="firstname" label="First Name" />
				<InputField name="lastname" label="Last Name" />
				<InputField name="email" label="Email" />
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
				<SubmitButton label="Register" className="mb-4" />
			</FormProvider>
		</ModalProvider>
	);
};

export default RegisterForm;
