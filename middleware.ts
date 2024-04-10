import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import { getSessionToken, updateSessionToken, updateSessionTokenObject } from './lib/session';

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const session = await getSessionToken();

	if (pathname.startsWith('/auth')) {
		if (
			session &&
			(pathname.startsWith('/auth/login') ||
				pathname.startsWith('/auth/register') ||
				pathname.startsWith('/auth/verify') ||
				pathname.startsWith('/auth/set-new-password') ||
				pathname.startsWith('/auth/forgot-password'))
		) {
			return NextResponse.redirect(new URL('/', request.url));
		}

		if (!session && pathname.startsWith('/auth/settings')) {
			return NextResponse.redirect(new URL('/auth/login?refresh=true', request.url));
		}

		if (pathname.startsWith('/auth/admin') && (!session || session.role !== 'ADMIN')) {
			return NextResponse.redirect(new URL('/auth/login?refresh=true', request.url));
		}
	}

	return await updateSessionToken(session);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		{
			source: '/((?!api|_next/static|_next/image|favicon.ico|jpg$|png$).*)',
			missing: [
				{ type: 'header', key: 'next-router-prefetch' },
				{ type: 'header', key: 'purpose', value: 'prefetch' },
			],
		},
	],
};
