'use client';

import FormProvider from '../context/FormProvider';
import { userSettingSchema, userSettingSchemaWithPassword } from '@/lib/validation';
import { z } from 'zod';
import FormError from './FormError';
import { changeSettingsAction, logoutAction } from '@/lib/session';
import InputFieldControlled from './InputFieldControlled';
import HiddenField from './HiddenField';
import ModalProvider from '../context/ModalProvider';
import SwitchToggle from './SwitchToggle';
import { useRef, useState } from 'react';
import PasswordField from './PasswordField';
import DeleteAccountForm from './DeleteAccountForm';
import { useRouter } from 'next/navigation';
import SettingsModal from '../fragments/SettingsModal';
import SubmitButton from './SubmitButton';
import UserMeta from './UserMeta';

type UserSetting = z.infer<typeof userSettingSchema> & {
	role: { id: number; name: string };
	status: { id: number; name: string };
	email: string;
	payload: string;
};

type Props = {
	user: UserSetting;
};

const SettingsForm: React.FC<Props> = ({ user }) => {
	const [togglePassword, setTogglePassword] = useState(false);
	const [toggleDangerZone, setToggleDangerZone] = useState(false);
	const passwordRef = useRef<HTMLInputElement[]>([]);
	const router = useRouter();
	const initFieldValues: Record<string, string> = {
		firstname: user.firstname,
		lastname: user.lastname,
	};

	function modalClickHandler() {
		if (togglePassword) {
			return new Promise<void>(async (resolve) => {
				await logoutAction();
				resolve();
			}).then(() => {
				router.push('/auth/login');
			});
		}
	}

	return (
		<ModalProvider>
			<UserMeta email={user.email} role={user.role?.name} status={user.status?.name} />
			<FormProvider
				dispatcher={changeSettingsAction}
				schema={togglePassword ? userSettingSchema : userSettingSchemaWithPassword}
				initValues={
					togglePassword
						? { ...initFieldValues, password: '', newPassword: '', confirmNewPassword: '' }
						: initFieldValues
				}
				passwordRefs={passwordRef}
				modal={{
					modalContent: <SettingsModal passwordChanged={togglePassword} />,
					modalClickHandler,
					buttonIds: [{ id: 'confirm', label: 'Okay' }],
				}}
			>
				<FormError />
				<HiddenField name={'payload'} value={user.payload} />
				<HiddenField name={'email'} value={user.email} />
				<InputFieldControlled name="firstname" label="First Name" />
				<InputFieldControlled name="lastname" label="Last Name" />
				<SwitchToggle
					id="togglePassword"
					title={['Close Password Section', 'Change Passwords']}
					checked={togglePassword}
					changeHandler={(e: React.ChangeEvent<HTMLInputElement>) => setTogglePassword((prev) => !prev)}
					className="mb-2 checked:after:bg-green-700"
				/>

				{togglePassword && (
					<div className="mt-4">
						<PasswordField
							name="password"
							label="Old Password"
							autoComplete="new-password"
							ref={(el) => {
								if (el) {
									passwordRef?.current?.push(el);
								}
							}}
						/>
						<PasswordField
							name="newPassword"
							label="New Password"
							autoComplete="new-password"
							ref={(el) => {
								if (el) {
									passwordRef?.current?.push(el);
								}
							}}
						/>
						<PasswordField
							name="confirmNewPassword"
							label="Confirm New Password"
							autoComplete="new-password"
							ref={(el) => {
								if (el) {
									passwordRef?.current?.push(el);
								}
							}}
						/>
					</div>
				)}
				<SubmitButton label="Change" className="mb-4" />
			</FormProvider>
			<SwitchToggle
				id="toggleDangerZone"
				title={['Close', 'Delete Account']}
				checked={toggleDangerZone}
				changeHandler={(e: React.ChangeEvent<HTMLInputElement>) => setToggleDangerZone((prev) => !prev)}
				className="my-4 checked:after:bg-red-700 "
			/>
			{toggleDangerZone && <DeleteAccountForm payload={user.payload} />}
		</ModalProvider>
	);
};

export default SettingsForm;
