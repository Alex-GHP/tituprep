import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardLoading() {
	return (
		<main className="mx-auto max-w-3xl px-4 py-6 md:py-10">
			{/* Header */}
			<div className="mb-6 flex items-center gap-3">
				<Skeleton className="h-10 w-10 rounded-xl" />
				<div>
					<Skeleton className="h-7 w-40" />
					<Skeleton className="mt-1 h-4 w-64" />
				</div>
			</div>

			{/* Your stats card */}
			<Card className="mb-6">
				<CardContent className="flex items-center justify-between py-4">
					<div className="flex items-center gap-3">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div>
							<Skeleton className="h-4 w-20" />
							<Skeleton className="mt-1 h-8 w-12" />
						</div>
					</div>
					<div className="flex gap-6">
						<Skeleton className="h-12 w-16" />
						<Skeleton className="h-12 w-16" />
						<Skeleton className="h-12 w-16" />
					</div>
				</CardContent>
			</Card>

			{/* Rankings card */}
			<Card>
				<CardHeader className="pb-3">
					<Skeleton className="h-5 w-32" />
				</CardHeader>
				<CardContent className="space-y-2">
					{Array.from({ length: 10 }).map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className="flex items-center gap-3 rounded-lg border border-border p-4"
						>
							<Skeleton className="h-8 w-8 rounded-full" />
							<Skeleton className="h-9 w-9 rounded-full" />
							<div className="flex-1">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="mt-1 h-3 w-20" />
							</div>
							<Skeleton className="h-5 w-12" />
						</div>
					))}
				</CardContent>
			</Card>
		</main>
	);
}
