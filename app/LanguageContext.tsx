"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { I18nProvider } from "./i18n";
import cookie from "cookie";

interface LanguageContextProps {
	currentLanguage: string;
	setCurrentLanguage: (language: string) => void;
}

// Create the context with a default value
export const LanguageContext = createContext<LanguageContextProps>({
	currentLanguage: "en",
	setCurrentLanguage: () => {},
});

interface LanguageProviderProps {
	children: ReactNode;
}

// Create a LanguageProvider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
	children,
	// initialLanguage,
}) => {
	const [currentLanguage, setCurrentLanguage] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("language") || "en";
		}
		return "en";
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedLanguage = localStorage.getItem("language") || "en";
			setCurrentLanguage(savedLanguage);
		}
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("language", currentLanguage);
		}
	}, [currentLanguage]);

	return (
		<LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
			<I18nProvider currentLocale={currentLanguage}>{children}</I18nProvider>
		</LanguageContext.Provider>
	);
};
