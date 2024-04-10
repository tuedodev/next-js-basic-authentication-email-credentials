'use client';

import FormProvider from '../context/FormProvider';
import { userSettingSchema, userSettingSchemaAdmin } from '@/lib/validation';
import { z } from 'zod';
import FormError from './FormError';
import InputFieldControlled from './InputFieldControlled';
import HiddenField from './HiddenField';
import ModalProvider from '../context/ModalProvider';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SelectFieldControlled from './SelectFieldControlled';
import { changeSettingsAdminAction } from '@/lib/session';
import MessageModal from '../fragments/MessageModal';
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

const SettingsFormAdmin: React.FC<Props> = ({ user }) => {
	const router = useRouter();
	const initValues = {
		firstname: user.firstname,
		lastname: user.lastname,
		role: user.role.name,
		status: user.status.name,
		password: '',
		newPassword: '',
		confirmNewPassword: '',
	};

	const modalClickHandler = useCallback(() => {
		router.push('/auth/admin');
	}, [router]);

	return (
		<ModalProvider>
			<UserMeta email={user.email} role={user.role?.name} status={user.status?.name} />
			<FormProvider
				dispatcher={changeSettingsAdminAction}
				schema={userSettingSchemaAdmin}
				initValues={initValues}
				modal={{
					modalContent: (
						<MessageModal
							title="Settings changed"
							messages={['You have successfully changed the settings of this user.']}
						/>
					),
					modalClickHandler,
					buttonIds: [{ id: 'confirm', label: 'Okay' }],
				}}
			>
				<FormError />
				<HiddenField name={'payload'} value={user.payload} />
				<HiddenField name={'email'} value={user.email} />
				<SelectFieldControlled
					name="role"
					label="Role"
					options={[
						{ id: 1, name: 'ADMIN' },
						{ id: 2, name: 'USER' },
					]}
					className="mb-4"
				/>
				<SelectFieldControlled
					name="status"
					label="Status"
					options={[
						{ id: 1, name: 'REGISTERED' },
						{ id: 2, name: 'ACTIVE' },
						{ id: 3, name: 'INACTIVE' },
					]}
					className="mb-4"
				/>
				<InputFieldControlled name="firstname" label="First Name" />
				<InputFieldControlled name="lastname" label="Last Name" />

				<SubmitButton label="Change" className="mb-4" />
			</FormProvider>
		</ModalProvider>
	);
};

export default SettingsFormAdmin;
