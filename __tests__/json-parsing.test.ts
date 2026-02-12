import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

describe("practice_exams.json structure", () => {
	const raw = fs.readFileSync(
		path.join(DATA_DIR, "practice_exams.json"),
		"utf-8",
	);
	const data = JSON.parse(raw);

	it("has a practice_exams array", () => {
		expect(data).toHaveProperty("practice_exams");
		expect(Array.isArray(data.practice_exams)).toBe(true);
	});

	it("contains exactly 20 exams", () => {
		expect(data.practice_exams).toHaveLength(20);
	});

	it("each exam has an exam_id from 1 to 20", () => {
		const ids = data.practice_exams.map(
			(e: { exam_id: number }) => e.exam_id,
		);
		expect(ids).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
	});

	it("each exam has at least 30 questions", () => {
		for (const exam of data.practice_exams) {
			expect(exam.questions.length).toBeGreaterThanOrEqual(30);
		}
	});

	it("every question has both ro and en keys", () => {
		for (const exam of data.practice_exams) {
			for (const q of exam.questions) {
				expect(q).toHaveProperty("ro");
				expect(q).toHaveProperty("en");
				expect(q).toHaveProperty("subject");
			}
		}
	});

	it("every question has required fields in both languages", () => {
		for (const exam of data.practice_exams) {
			for (const q of exam.questions) {
				for (const lang of ["ro", "en"] as const) {
					expect(q[lang]).toHaveProperty("question");
					expect(q[lang]).toHaveProperty("wrong_answers");
					expect(q[lang]).toHaveProperty("correct_answer");
					expect(q[lang]).toHaveProperty("explanation");
					// Questions can have 2, 3, or 4 wrong answers
					expect(q[lang].wrong_answers.length).toBeGreaterThanOrEqual(2);
					expect(q[lang].wrong_answers.length).toBeLessThanOrEqual(4);
					expect(typeof q[lang].question).toBe("string");
					expect(typeof q[lang].correct_answer).toBe("string");
				}
			}
		}
	});
});

describe("questions.json structure", () => {
	const raw = fs.readFileSync(
		path.join(DATA_DIR, "questions.json"),
		"utf-8",
	);
	const data = JSON.parse(raw);

	it("has exam.modules array", () => {
		expect(data).toHaveProperty("exam");
		expect(data.exam).toHaveProperty("modules");
		expect(Array.isArray(data.exam.modules)).toBe(true);
	});

	it("has exactly 4 modules", () => {
		expect(data.exam.modules).toHaveLength(4);
	});

	it("modules are named module1 through module4", () => {
		const moduleKeys = data.exam.modules.map(
			(m: Record<string, unknown>) => Object.keys(m)[0],
		);
		expect(moduleKeys).toEqual([
			"module1",
			"module2",
			"module3",
			"module4",
		]);
	});

	it("has 15 subjects across all modules", () => {
		let subjectCount = 0;
		for (const moduleObj of data.exam.modules) {
			for (const moduleVal of Object.values(moduleObj) as {
				subjects: Record<string, unknown[]>[];
			}[]) {
				for (const subjectDict of moduleVal.subjects) {
					subjectCount += Object.keys(subjectDict).length;
				}
			}
		}
		expect(subjectCount).toBe(15);
	});

	it("every question has both ro and en keys with required fields", () => {
		for (const moduleObj of data.exam.modules) {
			for (const moduleVal of Object.values(moduleObj) as {
				subjects: Record<string, { ro: Record<string, unknown>; en: Record<string, unknown> }[]>[];
			}[]) {
				for (const subjectDict of moduleVal.subjects) {
					for (const questions of Object.values(subjectDict)) {
						for (const q of questions) {
							expect(q).toHaveProperty("ro");
							expect(q).toHaveProperty("en");
							for (const lang of ["ro", "en"] as const) {
								expect(q[lang]).toHaveProperty("question");
								expect(q[lang]).toHaveProperty("wrong_answers");
								expect(q[lang]).toHaveProperty("correct_answer");
								expect(q[lang]).toHaveProperty("explanation");
							}
						}
					}
				}
			}
		}
	});
});
