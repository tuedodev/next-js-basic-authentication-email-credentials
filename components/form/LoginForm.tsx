'use client';

import React, { useEffect, useRef } from 'react';
import FormProvider from '../context/FormProvider';
import PasswordField from './PasswordField';
import InputField from './InputField';
import { loginAction } from '@/lib/session';
import { userSchema } from '@/lib/validation';
import FormError from './FormError';
import ModalProvider from '../context/ModalProvider';
import ThumbsUp from '../icons/ThumbsUp';
import SubmitButton from './SubmitButton';
import { useRouter } from 'next/navigation';

type Props = {
	refresh?: boolean;
};
const LoginForm: React.FC<Props> = ({ refresh = false }) => {
	const passwordRef = useRef<HTMLInputElement[]>([]);

	const router = useRouter();

	useEffect(() => {
		if (refresh) {
			router.refresh();
		}
	}, [refresh, router]);
	function redirectionHandler(): Promise<string> {
		return new Promise((resolve) => setTimeout(() => resolve('/'), 250));
	}

	return (
		<ModalProvider>
			<FormProvider
				dispatcher={loginAction}
				schema={userSchema}
				passwordRefs={passwordRef}
				initValues={{ email: '', password: '' }}
				modal={{
					modalContent: <ThumbsUp className="w-[120px] text-green-600" />,
					redirectionHandler,
				}}
			>
				<FormError />
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
				<SubmitButton label="Login" />
			</FormProvider>
		</ModalProvider>
	);
};

export default LoginForm;
