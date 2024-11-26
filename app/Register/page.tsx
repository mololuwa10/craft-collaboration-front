"use client";

import RegisterComponents from "@/components/RegisterComponents/RegisterComponents";
import { LanguageProvider } from "../LanguageContext";

export default function Register() {
	return (
		<>
			<LanguageProvider>
				<RegisterComponents />
			</LanguageProvider>
		</>
	);
}
