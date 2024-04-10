import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import dummyUser from './dummyUser.json';
import { createToken } from '../lib/utils';

async function main() {
	const rolesMap = new Map();
	const statusMap = new Map();
	try {
		const roles = ['ADMIN', 'USER'];
		for await (const role of roles) {
			const newRole = await prisma.role.upsert({
				where: { name: role },
				update: {},
				create: { name: role },
			});
			rolesMap.set(role, newRole.id);
		}
		const statuses = ['REGISTERED', 'ACTIVE', 'INACTIVE'];
		for await (const status of statuses) {
			const newStatus = await prisma.status.upsert({
				where: { name: status },
				update: {},
				create: { name: status },
			});
			statusMap.set(status, newStatus.id);
		}
	} catch (err) {
		console.log(err);
	}
	try {
		for (const user of dummyUser) {
			const pw = await hashPassword(user.password);
			const token = createToken(36);
			const { role, status, ...rest } = user;
			await prisma.user.create({
				data: { ...rest, password: pw, token, roleId: rolesMap.get(role), statusId: statusMap.get(status) },
			});
		}
	} catch (err) {
		console.log(err);
	}
}

main()
	.then(async () => await prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(18));
	const storedSalt = Buffer.from(salt).toString('base64');
	const passwordSalted = new TextEncoder().encode(password + storedSalt);
	const hashPasswordSalted = await crypto.subtle.digest('SHA-256', passwordSalted);
	const hashPasswordSaltedBase64 = `${Buffer.from(hashPasswordSalted).toString('base64')}${storedSalt}`;
	return hashPasswordSaltedBase64; // Last 24 characters are the salt
}
