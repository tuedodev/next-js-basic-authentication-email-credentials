import BaseLayout from '@/components/layout/BaseLayout';
import SessionProvider from '@/components/context/SessionProvider';
import type { Metadata } from 'next';
import './globals.css';
import { getSessionToken, getTheme } from '@/lib/session';
import ThemeProvider from '@/components/context/ThemeProvider';

export const metadata: Metadata = {
	title: 'Next JS Basic Authentication Email Credentials',
	description: 'Next JS Basic Authentication with Email Credentials',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const currentSession = await getSessionToken();
	let theme = await getTheme();

	return (
		<html lang="en" data-theme={theme}>
			<body className="font-sans">
				<ThemeProvider currentTheme={theme}>
					<SessionProvider currentSession={currentSession}>
						<BaseLayout>{children}</BaseLayout>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
