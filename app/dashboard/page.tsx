import { createClient } from "@/lib/supabase/server";
import { DashboardPage } from "@/components/dashboard-page";

interface StandardExamRow {
	id: string;
	exam_number: number | null;
	title_en: string | null;
	title_ro: string | null;
	exam_questions: { count: number }[];
}

interface SubjectExamRow {
	id: string;
	subject_id: string | null;
	title_en: string | null;
	title_ro: string | null;
	subjects: {
		id: string;
		name_en: string;
		name_ro: string;
		module: string | null;
	} | null;
	exam_questions: { count: number }[];
}

interface AttemptRow {
	exam_id: string;
	score: number;
}

export default async function Page() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Fetch standard exams with embedded question counts
	const { data: standardExamsRaw } = await supabase
		.from("exams")
		.select("id, exam_number, title_en, title_ro, exam_questions(count)")
		.eq("type", "standard")
		.order("exam_number");

	const standardExams = (standardExamsRaw ?? []) as unknown as StandardExamRow[];

	// Fetch subject exams with embedded question counts
	const { data: subjectExamsRaw } = await supabase
		.from("exams")
		.select(
			"id, subject_id, title_en, title_ro, subjects(id, name_en, name_ro, module), exam_questions(count)",
		)
		.eq("type", "subject")
		.order("subject_id");

	const subjectExams = (subjectExamsRaw ?? []) as unknown as SubjectExamRow[];

	// Fetch user's best scores per exam
	const { data: userAttemptsRaw } = await supabase
		.from("user_attempts")
		.select("exam_id, score")
		.eq("user_id", user!.id)
		.order("score", { ascending: false });

	const userAttempts = (userAttemptsRaw ?? []) as unknown as AttemptRow[];

	// Build best scores map: exam_id -> best score
	const bestScores: Record<string, number> = {};
	for (const attempt of userAttempts) {
		if (!(attempt.exam_id in bestScores)) {
			bestScores[attempt.exam_id] = attempt.score;
		}
	}

	return (
		<DashboardPage
			standardExams={standardExams.map((e) => {
				const eqCount = e.exam_questions?.[0]?.count ?? 0;
				return {
					id: e.id,
					examNumber: e.exam_number!,
					titleEn: e.title_en ?? `Exam #${e.exam_number}`,
					titleRo: e.title_ro ?? `Examen #${e.exam_number}`,
					bestScore: bestScores[e.id] ?? null,
					questionCount: eqCount,
				};
			})}
			subjectExams={subjectExams.map((e) => {
				const subject = e.subjects;
				const eqCount = e.exam_questions?.[0]?.count ?? 0;
				return {
					id: e.id,
					subjectId: e.subject_id!,
					nameEn: subject?.name_en ?? e.subject_id ?? "",
					nameRo: subject?.name_ro ?? e.subject_id ?? "",
					module: subject?.module ?? null,
					bestScore: bestScores[e.id] ?? null,
					questionCount: eqCount,
				};
			})}
		/>
	);
}
