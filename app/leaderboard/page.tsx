import { createClient } from "@/lib/supabase/server";
import { LeaderboardPage } from "@/components/leaderboard-page";

interface LeaderboardRow {
	user_id: string;
	display_name: string | null;
	avatar_url: string | null;
	total_score: number;
	streak_count: number;
	leaderboard_score: number;
	created_at: string;
}

export default async function Page() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data } = await supabase.rpc("get_leaderboard");

	const entries = (data ?? []) as unknown as LeaderboardRow[];

	return (
		<LeaderboardPage
			entries={entries.map((e, i) => ({
				rank: i + 1,
				userId: e.user_id,
				displayName: e.display_name || "Anonymous",
				avatarUrl: e.avatar_url,
				totalScore: Number(e.total_score),
				streakCount: e.streak_count,
				leaderboardScore: Number(e.leaderboard_score),
			}))}
			currentUserId={user?.id ?? null}
		/>
	);
}
