"use client";

import {
	Flame,
	Home,
	Info,
	LayoutDashboard,
	LogOut,
	Trophy,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/supabase/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
	const { user, signOut } = useAuth();
	const { t } = useLanguage();
	const pathname = usePathname();
	const router = useRouter();
	const [streak, setStreak] = useState<number>(0);

	// Fetch streak count for logged-in user
	useEffect(() => {
		if (!user) {
			setStreak(0);
			return;
		}
		const supabase = createClient();
		(
			supabase
				.from("profiles")
				.select("streak_count")
				.eq("id", user.id)
				.single() as unknown as Promise<{
				data: { streak_count: number } | null;
			}>
		).then(({ data }) => {
			if (data) setStreak(data.streak_count);
		});
	}, [user]);

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
					<img
						src="https://yelritsuffubrssyujmu.supabase.co/storage/v1/object/public/tituprep/public/logo.svg"
						alt="TituPrep logo"
						className="h-6 w-6"
					/>
					<span className="font-semibold text-lg">TituPrep</span>
				</Link>

				<div className="flex items-center gap-1">
					{user && (
						<>
							<Button
								variant={pathname === "/dashboard" ? "secondary" : "ghost"}
								size="sm"
								asChild
								className="gap-1.5 text-foreground"
							>
								<Link href="/dashboard">
									<LayoutDashboard className="h-4 w-4" />
									<span className="hidden sm:inline">{t("nav.dashboard")}</span>
								</Link>
							</Button>
							<Button
								variant={pathname === "/leaderboard" ? "secondary" : "ghost"}
								size="sm"
								asChild
								className="gap-1.5 text-foreground"
							>
								<Link href="/leaderboard">
									<Trophy className="h-4 w-4" />
									<span className="hidden sm:inline">
										{t("nav.leaderboard")}
									</span>
								</Link>
							</Button>
							<Button
								variant={pathname === "/about" ? "secondary" : "ghost"}
								size="sm"
								asChild
								className="gap-1.5 text-foreground"
							>
								<Link href="/about">
									<Info className="h-4 w-4" />
									<span className="hidden sm:inline">{t("nav.about")}</span>
								</Link>
							</Button>

							{/* Streak indicator */}
							<TooltipProvider delayDuration={200}>
								<Tooltip>
									<TooltipTrigger asChild>
										<div
											className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition-colors ${
												streak > 0 ? "text-orange-500" : "text-muted-foreground"
											}`}
										>
											<Flame
												className={`h-4 w-4 ${streak > 0 ? "text-orange-500" : ""}`}
											/>
											<span className="tabular-nums">{streak}</span>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											{streak} {t("nav.streak")}
										</p>
										<p className="text-xs text-muted-foreground">
											×{(1 + streak * 0.1).toFixed(1)}{" "}
											{t("leaderboard.multiplier").toLowerCase()}
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
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
								<span className="hidden sm:inline">{t("nav.home")}</span>
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
