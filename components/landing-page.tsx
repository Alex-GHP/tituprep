"use client";

import { ArrowRight, BarChart3, Code2, Github, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/supabase/auth-provider";
import { createClient } from "@/lib/supabase/client";

export function LandingPage() {
	const { t } = useLanguage();
	const { user } = useAuth();
	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		if (user) {
			router.push("/dashboard");
		}
	}, [user, router]);

	const handleGitHubSignIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	};

	return (
		<main className="flex flex-col items-center">
			{/* Hero */}
			<section className="w-full px-4 pt-20 pb-16 md:pt-32 md:pb-24">
				<div className="mx-auto max-w-3xl text-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
						<img
							src="https://yelritsuffubrssyujmu.supabase.co/storage/v1/object/public/tituprep/public/logo.svg"
							alt="TituPrep logo"
							className="h-4 w-4"
						/>
						<span>Practice Exam Platform</span>
					</div>
					<h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
						{t("hero.title")}
					</h1>
					<p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
						{t("hero.subtitle")}
					</p>
					<div className="mt-10 flex flex-col items-center gap-4">
						<Button
							size="lg"
							onClick={handleGitHubSignIn}
							className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-base"
						>
							<Github className="h-5 w-5" />
							{t("hero.cta")}
							<ArrowRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="w-full px-4 pb-16">
				<div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
					<Card className="bg-card border-border">
						<CardContent className="flex flex-col items-start gap-3 p-6">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<Timer className="h-5 w-5 text-primary" />
							</div>
							<h3 className="font-semibold text-card-foreground">
								{t("features.timedExams")}
							</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{t("features.timedExamsDesc")}
							</p>
						</CardContent>
					</Card>
					<Card className="bg-card border-border">
						<CardContent className="flex flex-col items-start gap-3 p-6">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<Code2 className="h-5 w-5 text-primary" />
							</div>
							<h3 className="font-semibold text-card-foreground">
								{t("features.codeQuestions")}
							</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{t("features.codeQuestionsDesc")}
							</p>
						</CardContent>
					</Card>
					<Card className="bg-card border-border">
						<CardContent className="flex flex-col items-start gap-3 p-6">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<BarChart3 className="h-5 w-5 text-primary" />
							</div>
							<h3 className="font-semibold text-card-foreground">
								{t("features.trackProgress")}
							</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{t("features.trackProgressDesc")}
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Developer Spotlight */}
			{/* <section className="w-full px-4 pb-16">
				<div className="mx-auto max-w-2xl">
					<Card className="bg-card border-border">
						<CardContent className="p-6 md:p-8">
							<h2 className="text-lg font-semibold text-card-foreground">
								{t("hero.spotlight")}
							</h2>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
								{t("hero.spotlightDesc")}
							</p>
						</CardContent>
					</Card>
				</div>
			</section> */}

			<Separator className="mx-auto max-w-sm" />

			{/* Auth */}
			<section className="w-full px-4 py-16">
				<div className="mx-auto max-w-sm">
					<p className="mb-4 text-center text-sm text-muted-foreground">
						{t("auth.signIn")}
					</p>
					<Button
						variant="outline"
						className="w-full gap-3 h-11 bg-card text-card-foreground border-border hover:bg-secondary"
						onClick={handleGitHubSignIn}
					>
						<Github className="h-4 w-4" />
						{t("auth.github")}
					</Button>
				</div>
			</section>
		</main>
	);
}
