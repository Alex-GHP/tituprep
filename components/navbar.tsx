"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-provider";
import { useLanguage } from "@/lib/language-context";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, LayoutDashboard, Home, Info } from "lucide-react";

export function Navbar() {
	const { user, signOut } = useAuth();
	const { t } = useLanguage();
	const pathname = usePathname();
	const router = useRouter();

	const handleSignOut = async () => {
		await signOut();
		router.push("/");
	};

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
			<nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
				<Link
					href={user ? "/dashboard" : "/"}
					className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
				>
					<BookOpen className="h-5 w-5 text-primary" />
					<span className="font-semibold text-lg">TituPrep</span>
				</Link>

				<div className="flex items-center gap-1">
					{user && (
						<>
							<Button
								variant={
									pathname === "/dashboard" ? "secondary" : "ghost"
								}
								size="sm"
								asChild
								className="gap-1.5 text-foreground"
							>
								<Link href="/dashboard">
									<LayoutDashboard className="h-4 w-4" />
									<span className="hidden sm:inline">
										{t("nav.dashboard")}
									</span>
								</Link>
							</Button>
							<Button
								variant={
									pathname === "/about" ? "secondary" : "ghost"
								}
								size="sm"
								asChild
								className="gap-1.5 text-foreground"
							>
								<Link href="/about">
									<Info className="h-4 w-4" />
									<span className="hidden sm:inline">
										{t("nav.about")}
									</span>
								</Link>
							</Button>
						</>
					)}
					{!user && (
						<Button
							variant={pathname === "/" ? "secondary" : "ghost"}
							size="sm"
							asChild
							className="gap-1.5 text-foreground"
						>
							<Link href="/">
								<Home className="h-4 w-4" />
								<span className="hidden sm:inline">
									{t("nav.home")}
								</span>
							</Link>
						</Button>
					)}

					<LanguageToggle />
					<ThemeToggle />

					{user && (
						<Button
							variant="ghost"
							size="icon"
							onClick={handleSignOut}
							className="text-muted-foreground hover:text-destructive"
							aria-label={t("nav.signOut")}
						>
							<LogOut className="h-4 w-4" />
						</Button>
					)}
				</div>
			</nav>
		</header>
	);
}
