import { User } from '@prisma/client';

export type CryptoResult =
	| {
			success: true;
			data: string;
			error: false;
	  }
	| {
			success: false;
			error: true;
			errorMsg: string;
	  };

export type Theme = 'light' | 'dark';

export type ThemeProviderType = {
	children: React.ReactNode;
	currentTheme: Theme;
};

export type ThemeContextType = {
	theme: Theme;
	setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

export type SessionContextType = {
	session: SessionType;
	setSession: React.Dispatch<React.SetStateAction<SessionType>>;
	isAuthenticated: boolean;
};

export type RoleType = 'USER' | 'ADMIN';

export type StatusType = 'REGISTERED' | 'ACTIVE' | 'INACTIVE';

export type RelationsType = { status: StatusType; role: RoleType };

export type SessionType = { firstname: string; lastname: string; email: string; role: RoleType } | null;

export type UserWithReferences = User & { role: { id: number; name: string }; status: { id: number; name: string } };

export type UserResult =
	| {
			success: true;
			data: User;
	  }
	| {
			success: false;
			error: string;
	  };
export type UserResultDB =
	| {
			user: UserWithReferences;
			payload: string;
			error: false;
	  }
	| {
			user: null;
			payload: null;
			error: string;
	  };
