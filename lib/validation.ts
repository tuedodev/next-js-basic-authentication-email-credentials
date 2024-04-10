import { ZodSchema, z } from 'zod';
import prisma from '@/lib/db';
import { compare } from './crypto';

export const emailSchema = z.object({
	email: z.string().trim().email({ message: 'Invalid email address.' }),
});

export const passwordSchema = z.object({
	password: z
		.string()
		.trim()
		.min(1, { message: 'This field is required.' })
		.min(8, { message: 'Password needs to have at least 8 characters.' })
		.max(255, { message: 'Way too long, only max. 255 characters, please.' }),
});

export const confirmPasswordSchema = z.object({
	confirmPassword: z
		.string({ required_error: 'Confirmation of password is required.' })
		.trim()
		.min(8, { message: 'Confirmation of password needs to have at least 8 characters.' })
		.max(255, { message: 'Way too long, only max. 255 characters, please.' }),
});

export const resetPasswordSchema = passwordSchema
	.merge(confirmPasswordSchema)
	.extend({
		payload: z.string().trim().min(1, { message: 'This field is required.' }),
	})
	.refine(
		(data) => {
			return data.password === data.confirmPassword;
		},
		{
			message: 'Both passwords must be identical.',
			path: ['confirmPassword'],
		}
	);

export const userSchema = emailSchema.merge(passwordSchema);

export const userServerSchema = userSchema.refine(
	async (data) => {
		try {
			/* A more performant db query function would be findUnique, but then you 
                would need to add the constraint @unique to your model schema */
			const user = await prisma.user.findFirst({
				where: {
					email: data.email,
				},
			});
			if (user) {
				return await compare(data.password, user.password);
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	},
	{ message: 'Login failed. Wrong email or password.', path: ['email', 'password'] }
);

export const accountSchema = userSchema
	.extend({
		firstname: z
			.string()
			.trim()
			.min(1, { message: 'This field is required.' })
			.min(3, { message: 'Length of first name at least 3 characters.' })
			.max(30, { message: 'Length of first name maximal 30 characters.' }),
		lastname: z
			.string()
			.trim()
			.min(1, { message: 'This field is required.' })
			.min(3, { message: 'Length of name at least 3 characters.' })
			.max(30, { message: 'Length of name maximal 30 characters.' }),
	})
	.merge(confirmPasswordSchema);

export const userSettingSchema = accountSchema
	.omit({ confirmPassword: true, password: true })
	.extend({ payload: z.string() });

export const userSettingSchemaAdmin = userSettingSchema
	.extend({ role: z.enum(['ADMIN', 'USER']) })
	.extend({ status: z.enum(['REGISTERED', 'ACTIVE', 'INACTIVE']) });

export const userSettingSchemaWithPassword = accountSchema
	.omit({ confirmPassword: true })
	.extend({ payload: z.string() })
	.extend({
		newPassword: z
			.string({ required_error: 'New password is required.' })
			.trim()
			.min(8, { message: 'Confirmation of password needs to have at least 8 characters.' })
			.max(255, { message: 'Way too long, only max. 255 characters, please.' }),
		confirmNewPassword: z
			.string({ required_error: 'Confirmation of new password is required.' })
			.trim()
			.min(8, { message: 'Confirmation of password needs to have at least 8 characters.' })
			.max(255, { message: 'Way too long, only max. 255 characters, please.' }),
	})
	.refine(
		(data) => {
			return data.newPassword !== data.password;
		},
		{
			message: 'New password must be different from the old one.',
			path: ['newPassword'],
		}
	)
	.refine(
		(data) => {
			return data.newPassword === data.confirmNewPassword;
		},
		{
			message: 'Both new passwords must be identical.',
			path: ['confirmNewPassword'],
		}
	);

export const registrationSchema = accountSchema.refine(
	(data) => {
		return data.password === data.confirmPassword;
	},
	{
		message: 'Both passwords must be identical.',
		path: ['confirmPassword'],
	}
);

export const emailServerSchema = emailSchema.refine(
	async (data) => {
		try {
			const user = await prisma.user.findFirst({
				where: {
					email: data.email,
				},
			});
			return user;
		} catch (e) {
			return false;
		}
	},
	{ message: 'Email does not exist.', path: ['email'] }
);

export const registrationServerSchema = registrationSchema
	.refine(
		async (data) => {
			try {
				/* A more performant db query function would be findUnique, but then you 
                would need to add the constraint @unique to your model schema */
				const user = await prisma.user.findFirst({
					where: {
						email: data.email,
					},
				});
				return !user;
			} catch (e) {
				return false;
			}
		},
		{ message: 'This email account already exists.', path: ['email'] }
	)
	.refine(
		(data) => {
			return !(data.firstname?.toLowerCase() === data.email.toLowerCase());
		},
		{ message: 'Same Firstname and email address are not allowed.', path: ['firstname'] }
	)
	.refine(
		(data) => {
			return !(data.lastname?.toLowerCase() === data.email.toLowerCase());
		},
		{ message: 'Same Lastname and email address are not allowed.', path: ['lastname'] }
	);

export const deleteAccountSchema = z
	.object({
		delete: z.string().trim(),
		payload: z.string().min(1, { message: 'This field is required.' }),
	})
	.refine(
		(data) => {
			return data.delete === 'DELETE';
		},
		{ message: 'Invalid confirmation.', path: ['delete'] }
	);
export function validatateRawFormDataAgainstSchema(schema: ZodSchema, formData: FormData) {
	const rawFormData = Object.fromEntries(formData.entries());
	const result = schema.safeParse(rawFormData);
	return result;
}

export async function asyncValidatateRawFormDataAgainstSchema(schema: ZodSchema, formData: FormData) {
	const rawFormData = Object.fromEntries(formData.entries());
	const result = await schema.safeParseAsync(rawFormData);
	return result;
}
