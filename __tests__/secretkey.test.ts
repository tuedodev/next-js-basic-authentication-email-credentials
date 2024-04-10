import { expect, describe, it, vi } from 'vitest';
import { cipherText } from '../lib/crypto';

describe('Missing Secret Key ', async () => {
	vi.stubEnv('SECRET_KEY', '');
	const string = 'This is a random string to cyper.';
	const data = await cipherText(string);

	it('should set error to true ...', () => {
		expect(data.error).toBe(true);
	});

	it('should set success to false', () => {
		expect(data.success).toBe(false);
	});

	it('should display an error message', () => {
		expect(data).toHaveProperty('errorMsg');
	});
});

describe('Existence of Secret Key ', async () => {
	vi.stubEnv('SECRET_KEY', 'MySecretKeyStoredInEnv');
	const string = 'This is a random string to cyper.';
	const data = await cipherText(string);

	it('should set error to false ...', () => {
		expect(data.error).toBe(false);
	});

	it('should set success to true', () => {
		expect(data.success).toBe(true);
	});

	it('should return data', () => {
		expect(data).toHaveProperty('data');
	});

	it('should not display any error message', () => {
		expect(data).not.toHaveProperty('errorMsg');
	});
});
