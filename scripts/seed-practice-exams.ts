/**
 * Seed the 20 standard practice exams from data/practice_exams.json.
 * Each exam's questions are inserted into the questions table,
 * then linked via exam_questions.
 */

import { supabase } from "./supabase-admin";
import { normalizeSubjectSlug } from "./seed-subjects";
import * as fs from "node:fs";
import * as path from "node:path";

interface PracticeExamQuestion {
	ro: {
		question: string;
		wrong_answers: string[];
		correct_answer: string;
		explanation: string;
	};
	en: {
		question: string;
		wrong_answers: string[];
		correct_answer: string;
		explanation: string;
	};
	subject: string;
}

interface PracticeExam {
	exam_id: number;
	questions: PracticeExamQuestion[];
}

interface PracticeExamsFile {
	practice_exams: PracticeExam[];
}

export async function seedPracticeExams() {
	console.log("Seeding practice exams...");

	const filePath = path.join(process.cwd(), "data", "practice_exams.json");
	const raw = fs.readFileSync(filePath, "utf-8");
	const data: PracticeExamsFile = JSON.parse(raw);

	let totalQuestions = 0;

	for (const exam of data.practice_exams) {
		console.log(
			`  Exam #${exam.exam_id}: ${exam.questions.length} questions`,
		);

		// Insert all questions for this exam
		const questionsToInsert = exam.questions.map((q) => ({
			question_en: q.en.question,
			question_ro: q.ro.question,
			correct_answer_en: q.en.correct_answer,
			correct_answer_ro: q.ro.correct_answer,
			wrong_answers_en: q.en.wrong_answers,
			wrong_answers_ro: q.ro.wrong_answers,
			explanation_en: q.en.explanation,
			explanation_ro: q.ro.explanation,
			subject_id: normalizeSubjectSlug(q.subject),
		}));

		const { data: insertedQuestions, error: qError } = await supabase
			.from("questions")
			.insert(questionsToInsert)
			.select("id");

		if (qError) {
			console.error(
				`  Error inserting questions for exam #${exam.exam_id}:`,
				qError,
			);
			throw qError;
		}

		if (!insertedQuestions || insertedQuestions.length === 0) {
			console.error(`  No questions returned for exam #${exam.exam_id}`);
			continue;
		}

		totalQuestions += insertedQuestions.length;

		// Create the exam
		const { data: examRow, error: examError } = await supabase
			.from("exams")
			.insert({
				exam_number: exam.exam_id,
				type: "standard",
				title_en: `Practice Exam #${exam.exam_id}`,
				title_ro: `Examen de Practica #${exam.exam_id}`,
			})
			.select("id")
			.single();

		if (examError || !examRow) {
			console.error(
				`  Error creating exam #${exam.exam_id}:`,
				examError,
			);
			throw examError;
		}

		// Link questions to exam
		const examQuestions = insertedQuestions.map((q, idx) => ({
			exam_id: examRow.id,
			question_id: q.id,
			position: idx + 1,
		}));

		const { error: linkError } = await supabase
			.from("exam_questions")
			.insert(examQuestions);

		if (linkError) {
			console.error(
				`  Error linking questions for exam #${exam.exam_id}:`,
				linkError,
			);
			throw linkError;
		}
	}

	console.log(
		`  Seeded ${data.practice_exams.length} exams with ${totalQuestions} questions total.`,
	);
}

// Run directly
if (process.argv[1]?.endsWith("seed-practice-exams.ts")) {
	seedPracticeExams()
		.then(() => {
			console.log("Done!");
			process.exit(0);
		})
		.catch(() => process.exit(1));
}
