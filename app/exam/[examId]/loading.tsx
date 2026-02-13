import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExamLoading() {
	return (
		<main className="mx-auto max-w-3xl px-4 py-6 md:py-10">
			<div className="mb-6 flex items-center justify-between">
				<Skeleton className="h-5 w-32" />
				<Skeleton className="h-8 w-24" />
			</div>
			<Skeleton className="mb-6 h-2 w-full" />
			<div className="mb-6 flex flex-wrap gap-1.5">
				{Array.from({ length: 10 }).map((_, i) => (
					<Skeleton key={`pill-${i}`} className="h-8 w-8 rounded-md" />
				))}
			</div>
			<Card className="border-border bg-card">
				<CardContent className="p-6">
					<Skeleton className="h-6 w-full" />
					<Skeleton className="mt-2 h-6 w-3/4" />
					<Skeleton className="mt-6 h-24 w-full rounded-lg" />
					<div className="mt-6 flex flex-col gap-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={`opt-${i}`} className="h-14 w-full rounded-lg" />
						))}
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
