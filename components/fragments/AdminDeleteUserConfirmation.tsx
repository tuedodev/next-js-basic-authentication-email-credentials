'use client';

type Props = {
	firstname: string;
	lastname: string;
	email: string;
	id: number;
};
const AdminDeleteUserConfirmation: React.FC<Props> = ({ firstname, lastname, email, id }) => {
	return (
		<>
			<h2 className="font-bold text-2xl border-b-4 border-slate-700/80 pb-2 mb-4">Delete User</h2>
			<p>
				Should User (Id: <strong>{id})</strong>
				<br />
				<strong>{`${firstname} ${lastname}`}</strong> with email <strong>{email}</strong>
				<br /> really be deleted?
			</p>
		</>
	);
};

export default AdminDeleteUserConfirmation;
