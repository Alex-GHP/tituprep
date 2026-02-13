import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/supabase/auth-provider";
import { LanguageProvider } from "@/lib/language-context";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains",
});

export const metadata: Metadata = {
	title: "TituPrep - Practice Exam Platform",
	description:
		"Master your CS exams with timed practice tests and subject-based training.",
	icons: {
		icon: "https://yelritsuffubrssyujmu.supabase.co/storage/v1/object/public/tituprep/public/logo.svg",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
		{ media: "(prefers-color-scheme: dark)", color: "#111827" },
	],
	width: "device-width",
	initialScale: 1,
};

export default async function RootLayout({
	children,
}: { children: React.ReactNode }) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider initialUser={user}>
						<LanguageProvider>
							<div className="flex min-h-screen flex-col">
								<Navbar />
								<div className="flex-1">{children}</div>
								<footer className="border-t border-border bg-background py-4 text-center text-xs text-muted-foreground">
									TituPrep &copy; {new Date().getFullYear()}
								</footer>
							</div>
						</LanguageProvider>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
