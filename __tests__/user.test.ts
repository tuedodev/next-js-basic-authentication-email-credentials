import { expect, describe, it, vi } from 'vitest';
import {
	createUser,
	deleteUser,
	getOrCreateRelations,
	getUserByEmail,
	getUserById,
	updateStatus,
	updateUser,
} from '@/lib/databaseQueries';
import {
	asyncValidatateRawFormDataAgainstSchema,
	registrationServerSchema,
	userSchema,
	validatateRawFormDataAgainstSchema,
} from '@/lib/validation';
import { createMagicLink, createToken } from '@/lib/utils';
import { compare, hashPassword } from '@/lib/crypto';

vi.stubEnv('SECRET_KEY', 'MySecretKeyStoredInEnv');

let validUser: Record<string, any> | null;
let dataValidUser: Record<string, any> = {
	firstname: 'John',
	lastname: 'Doe',
	email: 'example@example12345.com',
	password: 'start12345',
	confirmPassword: 'start12345',
};
let dataNotValidUser: Record<string, any> = {
	firstname: 'Milly',
	lastname: 'Jones',
	email: 'example123@example123456.com',
	password: 'start12345',
	confirmPassword: 'start123456',
};
const formDataValidUser = new FormData();
for (const [k, v] of Object.entries(dataValidUser)) {
	formDataValidUser.append(k, v);
}
const formDataNotValidUser = new FormData();
for (const [k, v] of Object.entries(dataNotValidUser)) {
	formDataNotValidUser.append(k, v);
}

describe.sequential('User Check CRUD Operations', async () => {
	it('validation should be successfull', async () => {
		const result = await asyncValidatateRawFormDataAgainstSchema(registrationServerSchema, formDataValidUser);
		if (!result.success) {
			console.log(result.error.flatten());
		}

		expect(result).toHaveProperty('success');
		expect(result).toHaveProperty('data');
		delete dataValidUser.confirmPassword;
	});
	it('validation should not be successfull', async () => {
		const result = await asyncValidatateRawFormDataAgainstSchema(registrationServerSchema, formDataNotValidUser);
		expect(result).toHaveProperty('success', false);
		expect(result).toHaveProperty('error');
	});
	it('creation of user should be successfull', async () => {
		const relations = await getOrCreateRelations({ role: 'USER', status: 'REGISTERED' });
		const token = createToken(36);
		const roleId = relations?.roleId || 0;
		const statusId = relations?.statusId || 0;
		validUser = await createUser({
			roleId,
			statusId,
			token,
			firstname: dataValidUser.firstname,
			lastname: dataValidUser.lastname,
			email: dataValidUser.email,
			password: await hashPassword(dataValidUser.password),
		});
		expect(validUser).not.toBeNull();
		expect(validUser).toHaveProperty('id');
		expect(validUser).toHaveProperty('token');
		expect(validUser).toHaveProperty('CreatedDate');
		expect(validUser).toHaveProperty('ModifiedDate');
	});
	it('new id is available', async () => {
		expect(validUser?.id).toBeGreaterThan(0);
	});
	it('create magiclink is successfull', async () => {
		const magicLink = await createMagicLink(validUser?.id, validUser?.token, '/auth/verify');
		console.log(magicLink);
		expect(magicLink).toContain('?key=');
		expect(magicLink).toContain('&token=');
	});
	it('should not create new User with the same email', async () => {
		const result = await asyncValidatateRawFormDataAgainstSchema(registrationServerSchema, formDataValidUser);
		expect(result).toHaveProperty('success', false);
		expect(result).toHaveProperty('error');
		if (result.success === false) {
			const errors = result.error.flatten();
			expect(errors.fieldErrors).toHaveProperty('email.0', 'This email account already exists.');
		}
	});
	it('valid new user should have Role User', async () => {
		const userRegistered = await getUserByEmail(dataValidUser.email);
		const relations = await getOrCreateRelations({ role: 'USER', status: 'REGISTERED' });
		expect(userRegistered?.roleId).toBe(relations?.roleId);
	});
	it('valid new user should be registered', async () => {
		const userRegistered = await getUserById(validUser?.id);
		const relations = await getOrCreateRelations({ role: 'USER', status: 'REGISTERED' });
		expect(userRegistered?.statusId).toBe(relations?.statusId);
	});
	it('registered user can be updated to ACTIVE user', async () => {
		const updateUserResult = await updateStatus(validUser?.id, 'ACTIVE');
		expect(updateUserResult).toHaveProperty('success', true);
	});
	it('Active user with correct email and correct password can login', async () => {
		const loginFormData = new FormData();
		loginFormData.append('email', validUser?.email);
		loginFormData.append('password', dataValidUser.password);
		const result = validatateRawFormDataAgainstSchema(userSchema, loginFormData);
		expect(result).toHaveProperty('success', true);
		expect(result).toHaveProperty('data');
		const user = await getUserByEmail(validUser?.email);
		if (!user) {
			throw 'Error: Cannot find user in database';
		}
		if (result.success && result.data) {
			const correctPassword = await compare(result.data.password, user.password);
			expect(correctPassword).toBe(true);
		} else {
			throw 'Error: Invalid login credentials';
		}
	});
	it('Active user with correct email and wrong password cannot login', async () => {
		const loginFormData = new FormData();
		loginFormData.append('email', validUser?.email);
		loginFormData.append('password', 'mywrongPassword2024');
		const result = validatateRawFormDataAgainstSchema(userSchema, loginFormData);
		expect(result).toHaveProperty('success', true);
		expect(result).toHaveProperty('data');
		const user = await getUserByEmail(validUser?.email);
		if (!user) {
			throw 'Error: Cannot find user in database';
		}
		if (result.success && result.data) {
			const correctPassword = await compare(result.data.password, user.password);
			expect(correctPassword).toBe(false);
		} else {
			throw 'Error: Invalid login credentials';
		}
	});
	it('Active user can be downgraded to Inactive user', async () => {
		const updateUserResult = await updateStatus(validUser?.id, 'INACTIVE');
		expect(updateUserResult).toHaveProperty('success', true);
		if (updateUserResult.success && updateUserResult.data) {
			const updatedUser = await getUserByEmail(updateUserResult.data.email);
			expect(updatedUser).not.toBe(null);
		} else {
			throw 'Error: Invalid login credentials';
		}
	});
	it('Active user can be updated to ADMIN user', async () => {
		const relations = await getOrCreateRelations({ role: 'ADMIN', status: 'ACTIVE' });
		const updateUserResult = await updateUser(validUser?.id, { roleId: relations?.roleId });
		expect(updateUserResult).toHaveProperty('id');
		if (updateUserResult) {
			const updatedUser = await getUserByEmail(updateUserResult.email);
			expect(updatedUser?.role.name).toMatch('ADMIN');
		} else {
			throw 'Error: Invalid login credentials';
		}
	});
	it('Admin users can be downgraded to users', async () => {
		const relations = await getOrCreateRelations({ role: 'USER', status: 'ACTIVE' });
		const updateUserResult = await updateUser(validUser?.id, { roleId: relations?.roleId });
		expect(updateUserResult).toHaveProperty('id');
		if (updateUserResult) {
			const updatedUser = await getUserById(updateUserResult.id.toString());
			expect(updatedUser?.role.name).toMatch('USER');
		} else {
			throw 'Error: Invalid login credentials';
		}
	});
	it('should delete new User', async () => {
		const deleteUserResult = await deleteUser(validUser?.id);
		expect(deleteUserResult).not.toBeNull();
		expect(deleteUserResult).toHaveProperty('success', true);
	});
});
