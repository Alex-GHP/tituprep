"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Generate a random 35-question exam with balanced subject distribution.
 * Creates a transient exam row with type='random' and links 35 questions.
 */
export async function generateRandomExam(): Promise<string | null> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	// Fetch all questions grouped by subject
	const { data: allQuestions } = await supabase
		.from("questions")
		.select("id, subject_id");

	if (!allQuestions || allQuestions.length === 0) return null;

	// Group by subject
	const bySubject: Record<string, string[]> = {};
	for (const q of allQuestions) {
		if (!bySubject[q.subject_id]) bySubject[q.subject_id] = [];
		bySubject[q.subject_id].push(q.id);
	}

	// Shuffle each subject's questions
	const subjects = Object.keys(bySubject);
	for (const s of subjects) {
		bySubject[s] = shuffleArray(bySubject[s]);
	}

	// Round-robin pick from each subject until we have 35
	const selected: string[] = [];
	let idx = 0;
	while (selected.length < 35 && idx < 100) {
		for (const s of subjects) {
			if (selected.length >= 35) break;
			const pool = bySubject[s];
			const pickIndex = Math.floor(idx / subjects.length);
			if (pickIndex < pool.length) {
				selected.push(pool[pickIndex]);
			}
		}
		idx += subjects.length;
	}

	// If we still don't have 35 (unlikely), fill from remaining
	if (selected.length < 35) {
		const remaining = allQuestions
			.filter((q) => !selected.includes(q.id))
			.map((q) => q.id);
		const shuffled = shuffleArray(remaining);
		for (const id of shuffled) {
			if (selected.length >= 35) break;
			selected.push(id);
		}
	}

	// Create the exam
	const { data: exam, error: examError } = await supabase
		.from("exams")
		.insert({
			type: "random",
			title_en: "Random Exam",
			title_ro: "Examen Aleator",
		})
		.select("id")
		.single();

	if (examError || !exam) return null;

	// Link questions
	const examQuestions = selected.map((qId, i) => ({
		exam_id: exam.id,
		question_id: qId,
		position: i + 1,
	}));

	await supabase.from("exam_questions").insert(examQuestions);

	return exam.id;
}

/**
 * Submit an exam attempt and save it to the database.
 */
export async function submitExamAttempt(params: {
	examId: string;
	answers: { questionId: string; selectedIndex: number | null; correct: boolean }[];
	timeTakenSeconds: number | null;
}): Promise<string | null> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const totalQuestions = params.answers.length;
	const correctCount = params.answers.filter((a) => a.correct).length;
	const score =
		Math.round((correctCount / totalQuestions) * 10 * 10) / 10;

	const { data: attempt, error } = await supabase
		.from("user_attempts")
		.insert({
			user_id: user.id,
			exam_id: params.examId,
			score,
			total_questions: totalQuestions,
			correct_count: correctCount,
			answers: params.answers as unknown as Record<string, unknown>[],
			time_taken_seconds: params.timeTakenSeconds,
		})
		.select("id")
		.single();

	if (error || !attempt) return null;

	return attempt.id;
}

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
