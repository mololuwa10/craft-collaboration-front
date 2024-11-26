import { IntlProvider } from "react-intl";
import English from "@/locales/en.json";
import French from "@/locales/fr.json";
import Italian from "@/locales/it.json";
import Spanish from "@/locales/es.json";
import Japan from "@/locales/ja.json";
import German from "@/locales/de.json";
import Portugese from "@/locales/pt-PT.json";

const messages = {
	en: English,
	fr: French,
	it: Italian,
	es: Spanish,
	ja: Japan,
	de: German,
	ptPT: Portugese,
};

import { ReactNode } from "react";

interface I18nProviderProps {
	children: ReactNode;
	currentLocale: string;
}

export function I18nProvider({ children, currentLocale }: I18nProviderProps) {
	const messageFile = messages[currentLocale] || messages["en"];

	return (
		<IntlProvider
			locale={currentLocale}
			messages={messageFile}
			defaultLocale="en"
		>
			{children}
		</IntlProvider>
	);
}
