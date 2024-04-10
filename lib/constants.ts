import type { Theme } from './types';

export const SESSION_EXPIRING_SECONDS = 10 * 60; /* 24 hours */
export const THEME_EXPIRING_SECONDS = 24 * 60 * 60; /* 24 hours */
export const EMAIL_VERIFICATION_LINK_VALID_SECONDS = 60 * 60; /* 1 hour */
export const EMAIL_PASSWORD_RESET_LINK_VALID_SECONDS = 15 * 60; /* 15 minutes */
export const DROPDOWN_MENU_DELAY = 180;
export const THROTTLE_EMAIL_DISPATCH_IN_MILLISECONDS = 1000 * 60 * 5; /* only 1 email can be sent every 5 minutes */
export const FALLBACK_THEME: Theme = 'dark'; /* Dark mode is standard theme*/
export const INITIAL_ERROR_STATE = {
	formErrors: [] as string[],
	fieldErrors: {},
};
export const STATUS_TAILWIND_BG_COLORS: Record<string, string> = {
	REGISTERED: 'bg-yellow-700/50',
	ACTIVE: 'bg-green-700/50',
	INACTIVE: 'bg-red-700/50',
};
