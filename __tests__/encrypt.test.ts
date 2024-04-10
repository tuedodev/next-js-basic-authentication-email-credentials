import { expect, describe, it, vi } from 'vitest';
import { cipherText, decipherText } from '../lib/crypto';

vi.stubEnv('SECRET_KEY', 'MySecretKeyStoredInEnv');

describe('function cipherText', async () => {
	const string = 'This is a random string.';
	const cipher = await cipherText(string);
	const data = cipher.success ? cipher.data : '';

	it('should not return the same string.', () => {
		expect(string).toEqual(expect.not.stringContaining(data));
	});
});

describe('Function decipherText ', async () => {
	const string = 'This is my random text.';
	const cipher = await cipherText(string);
	const data = cipher.success ? cipher.data : '';
	const decipher = await decipherText(data);
	const decipherData = decipher.success ? decipher.data : '';

	it('should return the original string', () => {
		expect(decipherData).toEqual(string);
	});

	it('should return error message if cipher text is changed', async () => {
		const decipher = await decipherText(data + '.');
		const errorMsgFromDecipher = decipher.error ? decipher.errorMsg : '';
		const dataFromDecipher = decipher.success ? decipher.data : '';
		expect(errorMsgFromDecipher.length).toBeGreaterThan(0);
		expect(dataFromDecipher.length).toEqual(0);
	});
});
