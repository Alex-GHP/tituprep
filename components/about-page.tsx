"use client";

import {
	Banknote,
	FileUser,
	Github,
	Globe,
	Linkedin,
	Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/language-context";

export function AboutPage() {
	const { t } = useLanguage();

	return (
		<main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
			<Card className="mt-6 bg-card border-border">
				<CardContent className="p-6 md:p-8">
					{/* <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
						<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
							<span className="text-2xl font-bold">CS</span>
						</div>
						<div className="flex flex-col gap-3 text-center sm:text-left">
							<div>
								<h2 className="text-xl font-semibold text-card-foreground">
									{t("about.student")}
								</h2>
								<p className="mt-1 text-sm text-muted-foreground">
									{t("about.university")}
								</p>
							</div>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{t("about.bio")}
							</p>
						</div>
					</div> */}

					{/* <Separator className="my-6" /> */}

					<div className="flex flex-col gap-3">
						<h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider">
							{t("about.connect")}
						</h3>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								className="gap-2 border-border text-foreground hover:bg-secondary"
								asChild
							>
								<a
									href="https://github.com/Alex-GHP/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Github className="h-4 w-4" />
									GitHub
								</a>
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="gap-2 border-border text-foreground hover:bg-secondary"
								asChild
							>
								<a
									href="https://www.linkedin.com/in/alexandru-gabriel-morariu-8657b0289/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Linkedin className="h-4 w-4" />
									LinkedIn
								</a>
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="gap-2 border-border text-foreground hover:bg-secondary"
								asChild
							>
								<a
									href="https://tituprep.ro/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Globe className="h-4 w-4" />
									{t("about.portfolio")}
								</a>
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="gap-2 border-border text-foreground hover:bg-secondary"
								asChild
							>
								<a href="mailto:alex.morariu.dev@gmail.com">
									<Mail className="h-4 w-4" />
									Email
								</a>
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="gap-2 border-border text-foreground hover:bg-secondary"
								asChild
							>
								<a
									href="https://drive.google.com/file/d/1dWtuja85suIptdufKW6u7SZSLLtx4pzs/view"
									target="_blank"
									rel="noopener noreferrer"
								>
									<FileUser className="h-4 w-4" />
									Resume
								</a>
							</Button>
						</div>
					</div>

					<Separator className="my-6" />

					<div className="flex flex-col gap-3">
						<h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider">
							{t("about.support")}
						</h3>
						<p className="text-sm text-muted-foreground">
							{t("about.supportDesc")}
						</p>
						<Button
							variant="outline"
							size="sm"
							className="gap-2 border-border text-foreground hover:bg-secondary"
							asChild
						>
							<a
								href="https://revolut.me/agmora/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Banknote className="h-4 w-4" />
								Revolut
							</a>
						</Button>
					</div>

					<Separator className="my-6" />

					<div className="flex flex-col gap-3">
						<h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider">
							{t("about.contributions")}
						</h3>
						<p className="text-sm text-muted-foreground">
							{t("about.contributionsDesc")}
						</p>
						<Button
							variant="outline"
							size="sm"
							className="gap-2 border-border text-foreground hover:bg-secondary"
							asChild
						>
							<a
								href="https://github.com/Alex-GHP/tituprep/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="h-4 w-4" />
								Repository
							</a>
						</Button>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
