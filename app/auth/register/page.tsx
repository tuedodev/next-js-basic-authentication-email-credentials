import RegisterForm from '@/components/form/RegisterForm';
import React from 'react';

const RegisterPage = async () => {
	return (
		<main className="grid grid-cols-[min(95%,_480px)] grid-rows-1 justify-center items-center px-4">
			<div className="w-full rounded-lg ring-2 ring-slate-700/40 focus-within:ring-slate-700/80 p-2">
				<h2 className="font-bold text-2xl border-b-4 border-slate-700/80 pb-2 mb-4">Register</h2>
				<RegisterForm />
			</div>
		</main>
	);
};

export default RegisterPage;
