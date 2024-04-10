'use server';

import prisma from '@/lib/db';
import { Prisma, User } from '@prisma/client';
import { RelationsType, SessionType, UserResult, UserResultDB, UserWithReferences } from './types';
import { encryptIdEmail } from './utils';
import { decipherText } from './crypto';

export async function getSessionUserFromDB(session: SessionType): Promise<UserResultDB> {
	return new Promise(async (resolve, _) => {
		try {
			const user = session?.email
				? await prisma.user.findFirst({
						where: {
							email: session.email,
						},
						include: { role: true, status: true },
				  })
				: null;
			if (user) {
				const payload = await encryptIdEmail({ id: user.id, email: user.email });
				resolve({ user, payload, error: false });
			} else {
				throw 'Not found';
			}
		} catch (err) {
			resolve({ user: null, payload: null, error: 'Could not find user in DB.' });
		}
	});
}

export async function getUser(key: string, token: string, expiring: number): Promise<UserResult> {
	return new Promise(async (resolve, _) => {
		try {
			const decipher = await decipherText(key);
			if (decipher.success) {
				const id = parseInt(decipher.data);
				if (typeof id === 'number') {
					const user = await prisma.user.findFirst({
						where: {
							id: id,
							token: token,
						},
					});
					if (user) {
						const modified = new Date(user.ModifiedDate);
						const delta = Math.floor((Date.now() - modified.getTime()) / 1000);
						if (delta > expiring) {
							await updateUser(user.id, {
								token: '',
							});
							resolve({ success: false, error: 'Token expired.' });
						} else {
							resolve({ success: true, data: user });
						}
					}
					resolve({ success: false, error: 'Invalid token.' });
				}
			}
			resolve({ success: false, error: 'Invalid token.' });
		} catch (err) {
			resolve({ success: false, error: 'A general error occurred.' });
		}
	});
}

export async function getUserById(id: string): Promise<UserWithReferences | null> {
	return new Promise(async (resolve, _) => {
		if (typeof parseInt(id) === 'number') {
			try {
				const user = await prisma.user.findFirst({
					where: {
						id: parseInt(id),
					},
					include: { role: true, status: true },
				});
				resolve(user);
			} catch (err) {
				resolve(null);
			}
		}
		resolve(null);
	});
}
export async function getUserByEmail(email: string): Promise<UserWithReferences | null> {
	return new Promise(async (resolve, _) => {
		try {
			const user = await prisma.user.findFirst({
				where: {
					email,
				},
				include: { role: true, status: true },
			});
			resolve(user);
		} catch (err) {
			resolve(null);
		}
		resolve(null);
	});
}

export async function getUserByIdEmail(id: number, email: string): Promise<User | null> {
	return new Promise((resolve, _) => {
		try {
			const user = prisma.user.findFirst({
				where: {
					id: id,
					email: email,
				},
			});
			resolve(user);
		} catch (err) {
			resolve(null);
		}
	});
}

export async function updateStatus(id: number, status: string): Promise<UserResult> {
	return new Promise(async (resolve, _) => {
		try {
			const activeStatus = await prisma.status.upsert({
				where: { name: status },
				update: {},
				create: { name: status },
			});
			const updateUserResult = await updateUser(id, {
				statusId: activeStatus.id,
				token: '',
			});

			if (updateUserResult) {
				resolve({ success: true, data: updateUserResult }); // redirectPath: '/auth/login',
			} else {
				resolve({ success: false, error: 'Could not update status. Please contact support.' });
			}
		} catch (err) {
			resolve({ success: false, error: 'Could not update user. Please contact support.' });
		}
	});
}

export async function createUser(data: Prisma.UserUncheckedCreateInput): Promise<User | null> {
	return new Promise(async (resolve, _) => {
		try {
			const user = await prisma.user.create({
				data,
			});
			resolve(user);
		} catch (err) {
			resolve(null);
		}
		resolve(null);
	});
}
export async function updateUser(id: number, data: Partial<User>): Promise<User | null> {
	return new Promise(async (resolve, _) => {
		try {
			const user = await prisma.user.update({
				where: {
					id: id,
				},
				data,
			});
			resolve(user);
		} catch (err) {
			resolve(null);
		}
	});
}

export async function deleteUser(id: number): Promise<UserResult> {
	return new Promise(async (resolve, _) => {
		try {
			const user = await prisma.user.delete({
				where: {
					id: id,
				},
			});
			resolve({ success: true, data: user });
		} catch (err) {
			resolve({ success: false, error: 'Could not delete user.' });
		}
	});
}

export async function getUserFromPayload(payload: string): Promise<User | null> {
	const decipher = await decipherText(payload);
	if (decipher.success) {
		const payloadObjekt = await JSON.parse(decipher.data);
		if ('id' in payloadObjekt && 'email' in payloadObjekt) {
			const { id, email } = payloadObjekt;
			if (typeof parseInt(id) === 'number') {
				try {
					const user = await prisma.user.findFirst({
						where: {
							id: parseInt(id),
							email: email,
						},
					});
					return user;
				} catch (err) {
					return null;
				}
			}
		}
	}
	return null;
}

export async function getOrCreateRelations(
	object: RelationsType
): Promise<{ statusId: number; roleId: number } | null> {
	return new Promise(async (resolve, _) => {
		try {
			const userRole = await prisma.role.upsert({
				where: { name: object.role },
				update: {},
				create: { name: object.role },
			});
			const registeredStatus = await prisma.status.upsert({
				where: { name: object.status },
				update: {},
				create: { name: object.status },
			});
			resolve({ statusId: registeredStatus.id, roleId: userRole.id });
		} catch (error) {
			resolve(null);
		}
	});
}

export async function getAllUsers(search: string): Promise<UserWithReferences[]> {
	try {
		const users = await prisma.user.findMany({
			where: {
				OR: [{ firstname: { contains: search } }, { lastname: { contains: search } }, { email: { contains: search } }],
			},
			include: { role: true, status: true },
		});
		return users;
	} catch (err) {
		return [];
	}
}
