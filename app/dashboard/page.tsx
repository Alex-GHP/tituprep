import { createClient } from "@/lib/supabase/server";
import { DashboardPage } from "@/components/dashboard-page";

export default async function Page() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Fetch standard exams (the 20 practice exams)
	const { data: standardExams } = await supabase
		.from("exams")
		.select("id, exam_number, title_en, title_ro")
		.eq("type", "standard")
		.order("exam_number");

	// Fetch subject exams
	const { data: subjectExams } = await supabase
		.from("exams")
		.select("id, subject_id, title_en, title_ro, subjects(id, name_en, name_ro, module)")
		.eq("type", "subject")
		.order("subject_id");

	// Fetch question counts per exam
	const { data: examQuestionCounts } = await supabase
		.from("exam_questions")
		.select("exam_id, question_id");

	// Fetch user's best scores per exam
	const { data: userAttempts } = await supabase
		.from("user_attempts")
		.select("exam_id, score")
		.eq("user_id", user!.id)
		.order("score", { ascending: false });

	// Build best scores map: exam_id -> best score
	const bestScores: Record<string, number> = {};
	for (const attempt of userAttempts ?? []) {
		if (!(attempt.exam_id in bestScores)) {
			bestScores[attempt.exam_id] = attempt.score;
		}
	}

	// Build question count map: exam_id -> count
	const questionCounts: Record<string, number> = {};
	for (const eq of examQuestionCounts ?? []) {
		questionCounts[eq.exam_id] = (questionCounts[eq.exam_id] ?? 0) + 1;
	}

	return (
		<DashboardPage
			standardExams={(standardExams ?? []).map((e) => ({
				id: e.id,
				examNumber: e.exam_number!,
				titleEn: e.title_en ?? `Exam #${e.exam_number}`,
				titleRo: e.title_ro ?? `Examen #${e.exam_number}`,
				bestScore: bestScores[e.id] ?? null,
				questionCount: questionCounts[e.id] ?? 0,
			}))}
			subjectExams={(subjectExams ?? []).map((e) => {
				const subject = e.subjects as unknown as {
					id: string;
					name_en: string;
					name_ro: string;
					module: string | null;
				};
				return {
					id: e.id,
					subjectId: e.subject_id!,
					nameEn: subject?.name_en ?? e.subject_id ?? "",
					nameRo: subject?.name_ro ?? e.subject_id ?? "",
					module: subject?.module ?? null,
					bestScore: bestScores[e.id] ?? null,
					questionCount: questionCounts[e.id] ?? 0,
				};
			})}
		/>
	);
}
