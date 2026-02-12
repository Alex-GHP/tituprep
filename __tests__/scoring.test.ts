import { describe, it, expect } from "vitest";

/**
 * Score calculation: (correctCount / totalQuestions) * 10, rounded to 1 decimal.
 * This mirrors the logic in lib/actions.ts submitExamAttempt and
 * the exam-page.tsx handleSubmit.
 */
function calculateScore(correctCount: number, totalQuestions: number): number {
	if (totalQuestions === 0) return 0;
	return Math.round((correctCount / totalQuestions) * 10 * 10) / 10;
}

describe("Score Calculation (0-10 scale)", () => {
	it("returns 10.0 for a perfect score", () => {
		expect(calculateScore(35, 35)).toBe(10.0);
	});

	it("returns 0.0 for no correct answers", () => {
		expect(calculateScore(0, 35)).toBe(0.0);
	});

	it("returns 5.0 for half correct on even total", () => {
		expect(calculateScore(5, 10)).toBe(5.0);
	});

	it("normalizes correctly for 20 out of 35", () => {
		expect(calculateScore(20, 35)).toBe(5.7);
	});

	it("normalizes correctly for 1 out of 38", () => {
		expect(calculateScore(1, 38)).toBe(0.3);
	});

	it("normalizes correctly for 37 out of 38", () => {
		expect(calculateScore(37, 38)).toBe(9.7);
	});

	it("handles single question exam", () => {
		expect(calculateScore(1, 1)).toBe(10.0);
		expect(calculateScore(0, 1)).toBe(0.0);
	});

	it("handles edge case of 0 total questions", () => {
		expect(calculateScore(0, 0)).toBe(0);
	});

	it("always returns a value between 0 and 10", () => {
		for (let total = 1; total <= 60; total++) {
			for (let correct = 0; correct <= total; correct++) {
				const score = calculateScore(correct, total);
				expect(score).toBeGreaterThanOrEqual(0);
				expect(score).toBeLessThanOrEqual(10);
			}
		}
	});
});
