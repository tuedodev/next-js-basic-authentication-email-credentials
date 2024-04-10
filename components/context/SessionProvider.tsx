'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { SessionContextType, SessionType } from '@/lib/types';
import { isValidUser } from '@/lib/utils';

const SessionContext = createContext<SessionContextType | null>(null);

type Props = {
	children: React.ReactNode;
	currentSession: SessionType;
};

const SessionProvider: React.FC<Props> = ({ children, currentSession }) => {
	const [session, setSession] = useState<SessionType>(currentSession);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isValidUser(currentSession));

	useEffect(() => {
		setSession((_) => currentSession);
		setIsAuthenticated((_) => isValidUser(currentSession));
	}, [currentSession]);

	return <SessionContext.Provider value={{ session, setSession, isAuthenticated }}>{children}</SessionContext.Provider>;
};

export function useSession() {
	const context = useContext(SessionContext);
	if (!context) throw new Error('useSession hook has to be used within a SessionProvider');
	return context;
}

export default SessionProvider;
