'use client';

type Props = {
	passwordChanged?: boolean;
};

const SettingsModal: React.FC<Props> = ({ passwordChanged }) => {
	return (
		<>
			<h2 className="font-bold text-2xl border-b-4 border-slate-700/80 pb-2 mb-4">Settings changed</h2>
			<p>You have successfully changed the settings of your account.</p>
			{passwordChanged && (
				<>
					<p>As you changed your password you will need to login again.</p>
					<p>You will be now redirected to the login page.</p>
				</>
			)}
		</>
	);
};

export default SettingsModal;
