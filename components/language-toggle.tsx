"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export function LanguageToggle() {
	const { language, setLanguage } = useLanguage();

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => setLanguage(language === "en" ? "ro" : "en")}
			className="gap-1.5 text-foreground hover:bg-secondary font-medium"
			aria-label="Toggle language"
		>
			<Languages className="h-4 w-4" />
			<span className="text-xs uppercase">
				{language === "en" ? "RO" : "EN"}
			</span>
		</Button>
	);
}
