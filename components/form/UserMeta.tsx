'use client';

import Symbol from '@/components/icons/Symbol';
import { STATUS_TAILWIND_BG_COLORS } from '@/lib/constants';

type Props = {
	email: string;
	role: string;
	status: string;
};

const UserMeta: React.FC<Props> = ({ email, role, status }) => {
	return (
		<div className="grid grid-cols-[auto_auto_1fr] grid-rows-3 gap-1 items-center mb-4">
			<p className="text-sm mr-4">E-Mail:</p>
			<p className="text-right text-xl col-span-2 break-all">{email}</p>
			<p className="text-sm mr-4">Role:</p>
			<Symbol
				title={role}
				label={role.charAt(0).toUpperCase()}
				className={role === 'ADMIN' ? 'bg-gray-700' : 'bg-gray-700/75'}
			/>
			<p className="text-right text-base font-bold">{role}</p>
			<p className="text-sm mr-4">Status:</p>
			<Symbol
				title={status}
				label={status.slice(0, 3).toUpperCase()}
				className={`text-[0.6rem] text-white ${STATUS_TAILWIND_BG_COLORS[status]}`}
			/>
			<p className="text-right text-base font-bold">{status}</p>
		</div>
	);
};

export default UserMeta;
