import LoginForm from '@/components/form/LoginForm';
import Link from 'next/link';

type Props = {
	searchParams: URLSearchParams;
};
const LoginPage = async ({ searchParams }: Props) => {
	const searchParamsObject = new URLSearchParams(searchParams);
	const hasRefresh = searchParamsObject.has('refresh');
	return (
		<main className="grid grid-cols-[min(95%,_480px)] grid-rows-1 justify-center items-center px-4">
			<div className="w-full rounded-lg ring-2 ring-slate-700/40 focus-within:ring-slate-700/80 p-2">
				<h2 className="font-bold text-2xl border-b-4 border-slate-700/80 pb-2 mb-4">Login</h2>
				<div className="rounded-lg mb-4">
					<p className="font-bold text-base">
						No account yet? Please{' '}
						<Link className="underline-2 text-blue-400 hover:text-blue-600" href="/auth/register">
							register
						</Link>
						.
					</p>
				</div>
				<LoginForm refresh={hasRefresh} />
				<div className="rounded-lg my-4">
					<p className="font-bold text-base">
						<Link
							className="underline-2 text-blue-400 hover:text-blue-600"
							href="/auth/forgot-password
"
						>
							Forgot your password?
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
};

export default LoginPage;
