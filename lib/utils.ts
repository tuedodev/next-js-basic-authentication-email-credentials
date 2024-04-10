import { SessionType } from './types';
import { cipherText } from './crypto';

export function isValidUser(session: SessionType | null) {
	return (
		(session && 'firstname' in session && 'lastname' in session && 'email' in session && 'role' in session) || false
	);
}

export async function createMagicLink(id: number, token: string, path: string): Promise<string> {
	const cipher = await cipherText(id.toString()); //await cipherText(user.id.toString());
	const key = cipher.success ? cipher.data : '';
	const magicLink = `http://localhost:3000${path}?key=${encodeURIComponent(key)}&token=${encodeURIComponent(token)}`;
	return magicLink;
}

export type EncryptIdEmailObject = {
	id: number;
	email: string;
};
export async function encryptIdEmail(object: EncryptIdEmailObject): Promise<string> {
	const cipher = await cipherText(JSON.stringify(object));
	if (cipher.success) {
		return cipher.data;
	}
	return '';
}

export function isEqualWithCurrentFormData(initValuesObject: Record<string, any>, currentFormDataObject: FormData) {
	const keys = Object.keys(initValuesObject);
	for (let key of keys) {
		if (!currentFormDataObject.has(key)) {
			return false;
		} else {
			if (initValuesObject[key] !== currentFormDataObject.get(key)) {
				return false;
			}
		}
	}
	return true;
}

export function createToken(length: number) {
	return Buffer.from(crypto.getRandomValues(new Uint8Array(length))).toString('base64');
}
