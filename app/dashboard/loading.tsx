import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
	return (
		<main className="mx-auto max-w-6xl px-4 py-8">
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Skeleton className="h-9 w-48" />
					<Skeleton className="mt-2 h-4 w-72" />
				</div>
				<Skeleton className="h-10 w-48" />
			</div>

			<Skeleton className="mb-6 h-10 w-full max-w-md" />

			<div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{Array.from({ length: 20 }).map((_, i) => (
					<Card key={`skeleton-${i}`} className="border-border bg-card">
						<CardContent className="flex flex-col items-center gap-3 p-4">
							<Skeleton className="h-10 w-10 rounded-full" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-5 w-12" />
						</CardContent>
					</Card>
				))}
			</div>
		</main>
	);
}
