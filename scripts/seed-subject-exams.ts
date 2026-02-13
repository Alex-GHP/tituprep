/**
 * Seed subject-based training exams from data/questions.json.
 * For each subject, creates one exam of type='subject' containing
 * ALL questions for that subject.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { supabase } from "./supabase-admin";

interface QuestionLocalized {
	question: string;
	wrong_answers: string[];
	correct_answer: string;
	explanation: string;
}

interface RawQuestion {
	ro: QuestionLocalized;
	en: QuestionLocalized;
}

interface QuestionsFile {
	exam: {
		modules: Record<string, { subjects: Record<string, RawQuestion[]>[] }>[];
	};
}

// Human-readable names for subject exams
const SUBJECT_NAMES: Record<string, { en: string; ro: string }> = {
	fundamentele_programarii: {
		en: "Programming Fundamentals Training",
		ro: "Antrenament Fundamentele Programarii",
	},
	programare_python: {
		en: "Python Programming Training",
		ro: "Antrenament Programare Python",
	},
	oop: {
		en: "OOP Training",
		ro: "Antrenament Programare Orientata pe Obiecte",
	},
	metode_avansate_de_programare_java: {
		en: "Advanced Java Training",
		ro: "Antrenament Metode Avansate Java",
	},
	tehnici_avansate_de_programare: {
		en: "Advanced Programming Training",
		ro: "Antrenament Tehnici Avansate de Programare",
	},
	dsa: {
		en: "Data Structures & Algorithms Training",
		ro: "Antrenament Structuri de Date si Algoritmi",
	},
	baze_de_date: {
		en: "Databases Training",
		ro: "Antrenament Baze de Date",
	},
	sisteme_de_gestiune_baze_de_date: {
		en: "DBMS Training",
		ro: "Antrenament Sisteme de Gestiune Baze de Date",
	},
	sisteme_de_operare: {
		en: "Operating Systems Training",
		ro: "Antrenament Sisteme de Operare",
	},
	retele_de_calculatoare: {
		en: "Computer Networks Training",
		ro: "Antrenament Retele de Calculatoare",
	},
	criptografie: {
		en: "Cryptography Training",
		ro: "Antrenament Criptografie",
	},
	tehnologii_web: {
		en: "Web Technologies Training",
		ro: "Antrenament Tehnologii Web",
	},
	comert_electronic: {
		en: "E-Commerce Training",
		ro: "Antrenament Comert Electronic",
	},
	cloud_computing: {
		en: "Cloud Computing Training",
		ro: "Antrenament Cloud Computing",
	},
	inovare_transformare_digitala: {
		en: "Digital Innovation Training",
		ro: "Antrenament Inovare Transformare Digitala",
	},
};

export async function seedSubjectExams() {
	console.log("Seeding subject exams from questions.json...");

	const filePath = path.join(process.cwd(), "data", "questions.json");
	const raw = fs.readFileSync(filePath, "utf-8");
	const data: QuestionsFile = JSON.parse(raw);

	let totalSubjects = 0;
	let totalQuestions = 0;

	for (const moduleObj of data.exam.modules) {
		for (const [moduleKey, moduleVal] of Object.entries(moduleObj)) {
			for (const subjectDict of moduleVal.subjects) {
				for (const [subjectId, questions] of Object.entries(subjectDict)) {
					console.log(
						`  ${moduleKey} / ${subjectId}: ${questions.length} questions`,
					);

					// Insert questions
					const questionsToInsert = (questions as RawQuestion[]).map((q) => ({
						question_en: q.en.question,
						question_ro: q.ro.question,
						correct_answer_en: q.en.correct_answer,
						correct_answer_ro: q.ro.correct_answer,
						wrong_answers_en: q.en.wrong_answers,
						wrong_answers_ro: q.ro.wrong_answers,
						explanation_en: q.en.explanation,
						explanation_ro: q.ro.explanation,
						subject_id: subjectId,
					}));

					const { data: insertedQuestions, error: qError } = await supabase
						.from("questions")
						.insert(questionsToInsert)
						.select("id");

					if (qError) {
						console.error(
							`  Error inserting questions for ${subjectId}:`,
							qError,
						);
						throw qError;
					}

					if (!insertedQuestions || insertedQuestions.length === 0) {
						console.error(`  No questions returned for ${subjectId}`);
						continue;
					}

					totalQuestions += insertedQuestions.length;

					// Create subject exam
					const names = SUBJECT_NAMES[subjectId] ?? {
						en: `${subjectId} Training`,
						ro: `Antrenament ${subjectId}`,
					};

					const { data: examRow, error: examError } = await supabase
						.from("exams")
						.insert({
							type: "subject",
							subject_id: subjectId,
							title_en: names.en,
							title_ro: names.ro,
						})
						.select("id")
						.single();

					if (examError || !examRow) {
						console.error(
							`  Error creating subject exam for ${subjectId}:`,
							examError,
						);
						throw examError;
					}

					// Link questions
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
							`  Error linking questions for ${subjectId}:`,
							linkError,
						);
						throw linkError;
					}

					totalSubjects++;
				}
			}
		}
	}

	console.log(
		`  Seeded ${totalSubjects} subject exams with ${totalQuestions} questions total.`,
	);
}

// Run directly
if (process.argv[1]?.endsWith("seed-subject-exams.ts")) {
	seedSubjectExams()
		.then(() => {
			console.log("Done!");
			process.exit(0);
		})
		.catch(() => process.exit(1));
}
