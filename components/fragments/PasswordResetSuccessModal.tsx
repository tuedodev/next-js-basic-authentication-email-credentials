'use client';

const PasswordResetSuccessModal = () => {
	return (
		<>
			<h2 className="font-bold text-2xl border-b-4 border-slate-700/80 pb-2 mb-4">Password successfully reset</h2>
			<p>Your password was successfully reset.</p>
			<p>As you changed your password you will need to login again.</p>
			<p>You will be now redirected to the login page.</p>
		</>
	);
};

export default PasswordResetSuccessModal;
