'use server';

import { CryptoResult } from './types';

/* Node supports now Crypto API, but NextJS with its edge runtime on top of the middleware cannot provide it (yet),
so we are using the Web Crypto API (normally usef for crypto in the browser!)here with a basic encryption/decryption 
functionallity mainly for session storage. 

Further information for below functions can be found here: 
https://www.tuedo.de/en/encryption-decryption-and-hashing-functions-based-web-crypto-api/

*/

export async function cipherText(text: string): Promise<CryptoResult> {
	return new Promise(async (resolve, _) => {
		try {
			const hashedSecretKey = await getHashedKey();
			const iv = crypto.getRandomValues(new Uint8Array(12)); // 16 characters long
			const algorithm = { name: 'AES-GCM', iv: iv };
			const encryptKey = await crypto.subtle.importKey('raw', hashedSecretKey, algorithm, false, ['encrypt']);
			const encrypted = await crypto.subtle.encrypt(algorithm, encryptKey, new TextEncoder().encode(text));
			const encryptedBase64 = Buffer.from(encrypted).toString('base64');
			const ivBase64 = Buffer.from(iv).toString('base64');
			resolve({
				success: true,
				error: false,
				data: `${encryptedBase64}${ivBase64}`,
			});
		} catch (error) {
			resolve({
				success: false,
				error: true,
				errorMsg: `${error}`,
			});
		}
	});
}

export async function decipherText(cipherText: string): Promise<CryptoResult> {
	return new Promise(async (resolve, _) => {
		try {
			const cipher = cipherText.slice(0, cipherText.length - 16); // 44
			const iv = cipherText.slice(cipherText.length - 16); // 44
			const hashedSecretKey = await getHashedKey();

			const ivBuffer = Buffer.from(iv, 'base64');
			const algorithm = { name: 'AES-GCM', iv: ivBuffer };
			const decryptKey = await crypto.subtle.importKey('raw', hashedSecretKey, algorithm, false, ['decrypt']);
			const decrypted = await crypto.subtle.decrypt(algorithm, decryptKey, Buffer.from(cipher, 'base64'));
			const decryptedText = new TextDecoder().decode(decrypted);
			resolve({
				success: true,
				error: false,
				data: decryptedText,
			});
		} catch (error) {
			resolve({
				success: false,
				error: true,
				errorMsg: `${error}`,
			});
		}
	});
}

export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(18));
	const storedSalt = Buffer.from(salt).toString('base64');
	const passwordSalted = new TextEncoder().encode(password + storedSalt);
	const hashPasswordSalted = await crypto.subtle.digest('SHA-256', passwordSalted);
	const hashPasswordSaltedBase64 = `${Buffer.from(hashPasswordSalted).toString('base64')}${storedSalt}`;
	return hashPasswordSaltedBase64; // Last 24 characters are the salt
}

export async function compare(password: string, storedPassword: string): Promise<boolean> {
	const oldStoredSalt = storedPassword.slice(storedPassword.length - 24);
	const passwordSalted = new TextEncoder().encode(password + oldStoredSalt);
	const passwordSaltedBase64 = Buffer.from(await crypto.subtle.digest('SHA-256', passwordSalted)).toString('base64');
	return storedPassword.slice(0, storedPassword.length - 24) === passwordSaltedBase64;
}
async function getHashedKey() {
	const secretKey = process.env.SECRET_KEY;
	if (!secretKey) {
		const ERROR = 'Missing secret key in your environment variables.';
		throw new Error(ERROR);
	}
	const hashedSecretKey = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secretKey));
	return hashedSecretKey;
}
