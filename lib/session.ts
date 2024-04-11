'use server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { cipherText, compare, decipherText, hashPassword } from '@/lib/crypto';
import type { RoleType, SessionType, Theme, UserWithReferences } from '@/lib/types';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import {
	FALLBACK_THEME,
	INITIAL_ERROR_STATE,
	SESSION_EXPIRING_SECONDS,
	THEME_EXPIRING_SECONDS,
	THROTTLE_EMAIL_DISPATCH_IN_MILLISECONDS,
} from './constants';
import { revalidatePath } from 'next/cache';
import {
	asyncValidatateRawFormDataAgainstSchema,
	deleteAccountSchema,
	emailServerSchema,
	registrationServerSchema,
	resetPasswordSchema,
	userSchema,
	userSettingSchema,
	userSettingSchemaAdmin,
	userSettingSchemaWithPassword,
	validatateRawFormDataAgainstSchema,
} from './validation';
import { ZodType, z } from 'zod';
import { createMagicLink, createToken } from './utils';
import { sendTransactionalEmail } from '../components/email/email';
import {
	createUser,
	deleteUser,
	getAllUsers,
	getOrCreateRelations,
	getUserByEmail,
	getUserFromPayload,
	updateUser,
} from './databaseQueries';

export async function updateSessionToken(session: SessionType) {
	const response = NextResponse.next();
	if (session) {
		const newCookie = await updateSessionTokenObject(session, {});
		response.cookies.set(newCookie as ResponseCookie);
	} else {
		response.cookies.delete('sessiontoken');
	}
	return response;
}

export async function getSessionToken(): Promise<SessionType> {
	const sessiontoken = cookies().get('sessiontoken')?.value;
	if (!sessiontoken) {
		return null;
	} else {
		const result = await decipherText(sessiontoken);
		if (result.success) {
			const sessionObject = await JSON.parse(result.data);
			if (
				'firstname' in sessionObject &&
				'lastname' in sessionObject &&
				'email' in sessionObject &&
				'role' in sessionObject
			) {
				return {
					firstname: sessionObject.firstname,
					lastname: sessionObject.lastname,
					email: sessionObject.email,
					role: sessionObject.role,
				};
			}
		}
		return null;
	}
}

export async function getTheme(): Promise<Theme> {
	let theme = cookies().get('theme')?.value;
	theme = theme === 'dark' || theme === 'light' ? theme : FALLBACK_THEME;
	return theme as Theme;
}

export async function updateSessionTokenObject(session: SessionType, updateObject: Partial<SessionType>) {
	const newSession = { ...session, ...updateObject };
	const value = JSON.stringify(newSession);
	const expires = new Date(Date.now() + SESSION_EXPIRING_SECONDS * 1000);
	const cipher = await cipherText(value);
	const newSessionToken = cipher.success ? cipher.data : '';
	return {
		name: 'sessiontoken',
		value: newSessionToken,
		httpOnly: true,
		expires,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		path: '/',
	};
}

export async function clientUpdatesThemeCookie(theme: Theme) {
	cookies().set({
		name: 'theme',
		value: theme,
		expires: new Date(Date.now() + THEME_EXPIRING_SECONDS * 1000),
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	});
}

export async function loginAction(
	previousState: any,
	formData: FormData
): Promise<z.inferFlattenedErrors<ZodType<any, any>>> {
	let serverValidation = INITIAL_ERROR_STATE;
	const result = validatateRawFormDataAgainstSchema(userSchema, formData);
	if (result.success) {
		const data = result.data;
		let user = await getUserByEmail(data.email);
		if (user) {
			const correctPassword = await compare(data.password, user.password);
			const status = user.status.name;
			if (correctPassword) {
				if (status === 'ACTIVE') {
					const newCookie = await updateSessionTokenObject(null, {
						firstname: user.firstname,
						lastname: user.lastname,
						email: user.email,
						role: user.role.name as RoleType,
					});
					cookies().set(newCookie as ResponseCookie);
				} else if (status === 'REGISTERED') {
					serverValidation = {
						...serverValidation,
						formErrors: ['Your account is not yet verified. Please check your email and spam folder.'],
					};
				} else {
					serverValidation = {
						...serverValidation,
						formErrors: ['This account is currently disabled. Please contact support.'],
					};
				}
			} else {
				serverValidation = { ...serverValidation, formErrors: ['Wrong email or password.'] };
			}
		} else {
			serverValidation = { ...serverValidation, formErrors: ['Wrong email or password.'] };
		}
	} else {
		serverValidation = result.error.flatten();
	}
	revalidatePath('/');
	return serverValidation;
}

export async function logoutAction(revalidatePathValue?: string) {
	cookies().delete('sessiontoken');
	if (revalidatePathValue) {
		revalidatePath(revalidatePathValue);
	} else {
		revalidatePath('/');
	}
}

export async function registerAction(
	previousState: any,
	formData: FormData
): Promise<z.inferFlattenedErrors<ZodType<any, any>>> {
	let serverValidation = INITIAL_ERROR_STATE;
	const result = await asyncValidatateRawFormDataAgainstSchema(registrationServerSchema, formData);
	if (result.success) {
		const { data: userdata } = result;
		try {
			const relations = await getOrCreateRelations({ role: 'USER', status: 'REGISTERED' });
			if (relations) {
				const token = createToken(36);
				const user = await createUser({
					firstname: userdata.firstname,
					lastname: userdata.lastname,
					email: userdata.email,
					roleId: relations.roleId,
					statusId: relations.statusId,
					password: await hashPassword(userdata.password),
					token,
				});
				if (!user) {
					throw 'Error: Could not create User.';
				}
				const magicLink = await createMagicLink(user.id, token, '/auth/verify');
				const sendEmailSuccessfully = await sendTransactionalEmail({
					email: user.email,
					firstname: user.firstname,
					lastname: user.lastname,
					magicLink: magicLink,
					variant: 'verify',
				});
				if (!sendEmailSuccessfully) {
					serverValidation = { ...serverValidation, formErrors: ['Error: Could not send transactional email.'] };
				}
			} else {
				serverValidation = {
					...serverValidation,
					formErrors: ['Error: Could not create Role and Status in database.'],
				};
			}
		} catch (err) {
			serverValidation = { ...serverValidation, formErrors: ['Error: Could not create user in database.'] };
		}
	} else {
		serverValidation = result.error.flatten();
	}
	revalidatePath('/auth/register');
	return serverValidation;
}

export async function changeSettingsAction(
	previousState: any,
	formData: FormData
): Promise<z.inferFlattenedErrors<ZodType<any, any>>> {
	let serverValidation = INITIAL_ERROR_STATE;
	const passwordChange = formData.has('password');
	const result = passwordChange
		? validatateRawFormDataAgainstSchema(userSettingSchemaWithPassword, formData)
		: validatateRawFormDataAgainstSchema(userSettingSchema, formData);
	if (result.success) {
		const data = result.data;
		const user = await getUserFromPayload(data.payload);
		if (!user) {
			serverValidation = { ...serverValidation, formErrors: ['Error: Could not find user in database.'] };
			return serverValidation;
		}
		let newData: Record<string, any> = {
			firstname: data.firstname,
			lastname: data.lastname,
		};
		if (passwordChange) {
			const correctPassword = await compare(data.password, user.password);
			if (!correctPassword) {
				serverValidation = { ...serverValidation, fieldErrors: { password: 'Wrong password.' } };
				return serverValidation;
			}
			newData = {
				...newData,
				password: await hashPassword(data.newPassword),
			};
		}
		const updateUserResult = await updateUser(user.id, newData);
		if (!updateUserResult) {
			serverValidation = { ...serverValidation, formErrors: ['Error: Could not update user in database.'] };
		}
	} else {
		serverValidation = result.error.flatten();
	}
	revalidatePath('/auth/settings');
	return serverValidation;
}

export async function changeSettingsAdminAction(
	previousState: any,
	formData: FormData
): Promise<z.inferFlattenedErrors<ZodType<any, any>>> {
	let serverValidation = INITIAL_ERROR_STATE;
	const result = validatateRawFormDataAgainstSchema(userSettingSchemaAdmin, formData);
	if (result.success) {
		const data = result.data;
		const user = await getUserFromPayload(data.payload);
		if (!user) {
			serverValidation = { ...serverValidation, formErrors: ['Error: Could not find user in database.'] };
			return serverValidation;
		}
		let newData: Record<string, any> = {
			firstname: data.firstname,
			lastname: data.lastname,
		};
		const relations = await getOrCreateRelations({
			role: data.role,
			status: data.status,
		});
		if (relations) {
			newData = {
				...newData,
				roleId: relations.roleId,
				statusId: relations.statusId,
			};
		}
		const updateUserResult = await updateUser(user.id, newData);
		if (!updateUserResult) {
			serverValidation = { ...serverValidation, formErrors: ['Error: Could not update user in database.'] };
		}
	} else {
		serverValidation = result.error.flatten();
	}

	return serverValidation;
	revalidatePath('/auth/settings');
}

export async function passwordForgotAction(
	previousState: any,
	formData: FormData
): Promise<z.inferFlattenedErrors<ZodType<any, any>>> {
	const result = await asyncValidatateRawFormDataAgainstSchema(emailServerSchema, formData);
	if (result.success) {
		const data = result.data;
		try {
			const token = createToken(36);
			const user = await getUserByEmail(data.email);
			if (user && user.ModifiedDate < new Date(Date.now() - THROTTLE_EMAIL_DISPATCH_IN_MILLISECONDS)) {
				// only once in 5 minutes a token will be generated and an email will be sent
				const updateUserResult = await updateUser(user.id, { token });
				if (!updateUserResult) {
					throw 'Could not generate token for user in database.';
				}
				const magicLink = await createMagicLink(user.id, token, '/auth/set-new-password');
				const sendEmailSuccessfully = await sendTransactionalEmail({
					email: user.email,
					firstname: user.firstname,
					lastname: user.lastname,
					magicLink: magicLink,
					variant: 'forgotPassword',
				});
				if (!sendEmailSuccessfully) {
					throw 'Could not send transactional email.';
				}
			}
		} catch (err) {
			console.log('Password Forgot Error: ', err);
		}
	} else {
		/* No error is displayed, the user is for security reasons given no information whether this e-mail exists or not. */
	}
	return INITIAL_ERROR_STATE;
}

export async function resetPasswordAction(
	previousState: any,
	formData: FormData
): Promise<z.inferFlattenedErrors<ZodType<any, any>>> {
	let serverValidation = INITIAL_ERROR_STATE;
	const result = validatateRawFormDataAgainstSchema(resetPasswordSchema, formData);
	if (result.success) {
		const data = result.data;
		const user = await getUserFromPayload(data.payload);
		if (!user) {
			serverValidation = { ...serverValidation, formErrors: ['Error: Could not find user in database.'] };
			return serverValidation;
		}
		const updateUserResult = await updateUser(user.id, {
			password: await hashPassword(data.password),
		});
		if (!updateUserResult) {
			serverValidation = { ...serverValidation, formErrors: ['Error: Could not update user in database.'] };
		}
	} else {
		serverValidation = result.error.flatten();
	}
	revalidatePath('/auth/set-new-password');
	return serverValidation;
}

export async function deleteAccount(
	previousState: any,
	formData: FormData
): Promise<z.inferFlattenedErrors<ZodType<any, any>>> {
	let serverValidation = INITIAL_ERROR_STATE;
	const result = validatateRawFormDataAgainstSchema(deleteAccountSchema, formData);
	if (result.success) {
		const data = result.data;
		const user = await getUserFromPayload(data.payload);
		if (!user) {
			serverValidation = { ...serverValidation, formErrors: ['Error: Could not find user in database.'] };
			return serverValidation;
		}
		const deleteResult = await deleteUser(user.id);
		if (deleteResult.success) {
			return serverValidation;
		} else {
			serverValidation = { ...serverValidation, formErrors: ['Error: Could not delete user in database.'] };
		}
	} else {
		serverValidation = result.error.flatten();
	}
	return serverValidation;
}

export async function searchAction(previousState: any, formData: FormData): Promise<UserWithReferences[]> {
	const rawFormData = Object.fromEntries(formData.entries());
	const search = rawFormData['search'] as string;
	return new Promise(async (resolve, _) => {
		const users = await getAllUsers(search);
		resolve(users);
	});
}
export { sendTransactionalEmail };
