'use client';

import { Theme, ThemeContextType, ThemeProviderType } from '@/lib/types';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider: React.FC<ThemeProviderType> = ({ children, currentTheme }) => {
	const [theme, setTheme] = useState<Theme>(currentTheme);
	useEffect(() => {
		setTheme((_) => currentTheme);
	}, [currentTheme]);

	return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) throw new Error('useTheme hook has to be used within a ThemeProvider');
	return context;
}

export default ThemeProvider;
