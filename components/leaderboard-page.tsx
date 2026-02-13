"use client";

import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Flame, Crown, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
	rank: number;
	userId: string;
	displayName: string;
	avatarUrl: string | null;
	totalScore: number;
	streakCount: number;
	leaderboardScore: number;
}

interface LeaderboardPageProps {
	entries: LeaderboardEntry[];
	currentUserId: string | null;
}

function getRankIcon(rank: number) {
	if (rank === 1)
		return <Crown className="h-5 w-5 text-yellow-500" />;
	if (rank === 2)
		return <Medal className="h-5 w-5 text-gray-400" />;
	if (rank === 3)
		return <Award className="h-5 w-5 text-amber-600" />;
	return null;
}

function getRankStyle(rank: number, isCurrentUser: boolean) {
	const base = "flex items-center gap-3 rounded-lg border p-3 sm:p-4 transition-colors";

	if (isCurrentUser && rank <= 3) {
		// Current user AND top 3 — combine both highlights
		if (rank === 1)
			return `${base} border-yellow-500/50 bg-yellow-500/10 ring-2 ring-primary/50`;
		if (rank === 2)
			return `${base} border-gray-400/50 bg-gray-400/10 ring-2 ring-primary/50`;
		return `${base} border-amber-600/50 bg-amber-600/10 ring-2 ring-primary/50`;
	}

	if (rank === 1) return `${base} border-yellow-500/50 bg-yellow-500/10`;
	if (rank === 2) return `${base} border-gray-400/50 bg-gray-400/10`;
	if (rank === 3) return `${base} border-amber-600/50 bg-amber-600/10`;
	if (isCurrentUser) return `${base} border-primary/50 bg-primary/10 ring-2 ring-primary/30`;

	return `${base} border-border bg-card hover:bg-muted/50`;
}

function getInitials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function LeaderboardPage({
	entries,
	currentUserId,
}: LeaderboardPageProps) {
	const { t } = useLanguage();

	const currentUserEntry = entries.find((e) => e.userId === currentUserId);

	return (
		<main className="mx-auto max-w-3xl px-4 py-6 md:py-10">
			{/* Header */}
			<div className="mb-6 flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
					<Trophy className="h-5 w-5 text-primary" />
				</div>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						{t("leaderboard.title")}
					</h1>
					<p className="text-sm text-muted-foreground">
						{t("leaderboard.subtitle")}
					</p>
				</div>
			</div>

			{/* Current user quick stats */}
			{currentUserEntry && (
				<Card className="mb-6 border-primary/30 bg-primary/5">
					<CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
						<div className="flex items-center gap-3">
							<Avatar className="h-10 w-10 border-2 border-primary/30">
								<AvatarImage
									src={currentUserEntry.avatarUrl ?? undefined}
									alt={currentUserEntry.displayName}
								/>
								<AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
									{getInitials(currentUserEntry.displayName)}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-semibold text-sm">
									{t("leaderboard.yourRank")}
								</p>
								<p className="text-2xl font-bold text-primary">
									#{currentUserEntry.rank}
								</p>
							</div>
						</div>
						<div className="flex gap-6">
							<div className="text-center">
								<p className="text-xs text-muted-foreground">
									{t("leaderboard.score")}
								</p>
								<p className="text-lg font-bold">
									{currentUserEntry.leaderboardScore.toFixed(1)}
								</p>
							</div>
							<div className="text-center">
								<p className="text-xs text-muted-foreground">
									{t("leaderboard.streak")}
								</p>
								<div className="flex items-center justify-center gap-1">
									<Flame className="h-4 w-4 text-orange-500" />
									<p className="text-lg font-bold">
										{currentUserEntry.streakCount}
									</p>
								</div>
							</div>
							<div className="text-center">
								<p className="text-xs text-muted-foreground">
									{t("leaderboard.multiplier")}
								</p>
								<p className="text-lg font-bold text-primary">
									×{(1 + currentUserEntry.streakCount * 0.1).toFixed(1)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Leaderboard list */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-lg">
						<Trophy className="h-4 w-4 text-primary" />
						{t("leaderboard.rankings")}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{entries.length === 0 && (
						<p className="py-8 text-center text-muted-foreground">
							{t("leaderboard.empty")}
						</p>
					)}
					{entries.map((entry) => {
						const isCurrentUser = entry.userId === currentUserId;
						return (
							<div
								key={entry.userId}
								className={getRankStyle(entry.rank, isCurrentUser)}
							>
								{/* Rank */}
								<div className="flex h-8 w-8 shrink-0 items-center justify-center">
									{getRankIcon(entry.rank) ?? (
										<span className="text-sm font-semibold text-muted-foreground">
											{entry.rank}
										</span>
									)}
								</div>

								{/* Avatar */}
								<Avatar className="h-9 w-9 shrink-0 border border-border">
									<AvatarImage
										src={entry.avatarUrl ?? undefined}
										alt={entry.displayName}
									/>
									<AvatarFallback className="bg-muted text-xs font-semibold">
										{getInitials(entry.displayName)}
									</AvatarFallback>
								</Avatar>

								{/* Name + badges */}
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<span
											className={`truncate text-sm font-medium ${isCurrentUser ? "text-primary" : ""}`}
										>
											{entry.displayName}
										</span>
										{isCurrentUser && (
											<Badge
												variant="secondary"
												className="shrink-0 text-[10px] px-1.5 py-0"
											>
												{t("leaderboard.you")}
											</Badge>
										)}
									</div>
									{entry.streakCount > 0 && (
										<div className="flex items-center gap-1 mt-0.5">
											<Flame className="h-3 w-3 text-orange-500" />
											<span className="text-xs text-muted-foreground">
												{entry.streakCount} {t("leaderboard.dayStreak")}
												{" · "}×
												{(1 + entry.streakCount * 0.1).toFixed(1)}
											</span>
										</div>
									)}
								</div>

								{/* Score */}
								<div className="shrink-0 text-right">
									<p className="text-sm font-bold">
										{entry.leaderboardScore.toFixed(1)}
									</p>
									{entry.streakCount > 0 && (
										<p className="text-[10px] text-muted-foreground">
											{t("leaderboard.base")}: {entry.totalScore.toFixed(1)}
										</p>
									)}
								</div>
							</div>
						);
					})}
				</CardContent>
			</Card>

			{/* Scoring explanation */}
			<Card className="mt-4">
				<CardContent className="py-4">
					<p className="text-xs text-muted-foreground leading-relaxed">
						<strong className="text-foreground">
							{t("leaderboard.howItWorks")}
						</strong>{" "}
						{t("leaderboard.howItWorksDesc")}
					</p>
				</CardContent>
			</Card>
		</main>
	);
}
