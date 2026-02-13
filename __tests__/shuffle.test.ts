import { describe, expect, it } from "vitest";

/**
 * Deterministic seeded shuffle -- mirrors the implementation in
 * components/exam-page.tsx and components/results-page.tsx
 */
function seededShuffle<T>(array: T[], seed: string): T[] {
	const shuffled = [...array];
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	for (let i = shuffled.length - 1; i > 0; i--) {
		hash = (hash * 1664525 + 1013904223) | 0;
		const j = (hash >>> 0) % (i + 1);
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

describe("Seeded Shuffle", () => {
	it("returns an array of the same length", () => {
		const input = [0, 1, 2, 3];
		const result = seededShuffle(input, "test-seed");
		expect(result).toHaveLength(input.length);
	});

	it("contains all original elements", () => {
		const input = [0, 1, 2, 3, 4, 5];
		const result = seededShuffle(input, "my-seed");
		expect(result.sort()).toEqual(input.sort());
	});

	it("is deterministic (same seed produces same result)", () => {
		const input = [0, 1, 2, 3, 4];
		const seed = "question-uuid-123";
		const result1 = seededShuffle(input, seed);
		const result2 = seededShuffle(input, seed);
		expect(result1).toEqual(result2);
	});

	it("different seeds produce different results", () => {
		const input = [0, 1, 2, 3, 4, 5, 6, 7];
		const result1 = seededShuffle(input, "seed-a");
		const result2 = seededShuffle(input, "seed-b");
		// They might theoretically be the same, but with 8! = 40320 permutations it's extremely unlikely
		expect(result1).not.toEqual(result2);
	});

	it("does not modify the original array", () => {
		const input = [0, 1, 2, 3];
		const copy = [...input];
		seededShuffle(input, "test");
		expect(input).toEqual(copy);
	});

	it("handles single element array", () => {
		expect(seededShuffle([42], "any")).toEqual([42]);
	});

	it("handles empty array", () => {
		expect(seededShuffle([], "any")).toEqual([]);
	});
});

describe("Options Shuffling (correct answer always included)", () => {
	it("correct answer is always present in shuffled options", () => {
		const wrongAnswers = ["Wrong A", "Wrong B", "Wrong C"];
		const correctAnswer = "Correct!";
		const allOptions = [...wrongAnswers, correctAnswer];

		// Try with many different seeds
		for (let i = 0; i < 100; i++) {
			const seed = `question-${i}`;
			const indices = seededShuffle(
				allOptions.map((_, idx) => idx),
				seed,
			);
			const shuffled = indices.map((idx) => allOptions[idx]);

			expect(shuffled).toContain(correctAnswer);
			expect(shuffled).toHaveLength(4);

			// Verify correctIndex tracking works
			const correctIndex = indices.indexOf(allOptions.length - 1);
			expect(shuffled[correctIndex]).toBe(correctAnswer);
		}
	});
});

describe("Random Exam Generation (balanced distribution)", () => {
	/**
	 * Simulate the balanced distribution algorithm from lib/actions.ts
	 */
	function generateBalancedExam(
		questionsBySubject: Record<string, string[]>,
		targetCount: number,
	): string[] {
		const subjects = Object.keys(questionsBySubject);
		const pools: Record<string, string[]> = {};
		for (const s of subjects) {
			pools[s] = [...questionsBySubject[s]];
		}

		const selected: string[] = [];
		let idx = 0;
		while (selected.length < targetCount && idx < 1000) {
			for (const s of subjects) {
				if (selected.length >= targetCount) break;
				const pickIndex = Math.floor(idx / subjects.length);
				if (pickIndex < pools[s].length) {
					selected.push(pools[s][pickIndex]);
				}
			}
			idx += subjects.length;
		}
		return selected;
	}

	it("returns exactly 35 questions", () => {
		const subjects: Record<string, string[]> = {};
		for (let i = 0; i < 15; i++) {
			subjects[`subject_${i}`] = Array.from(
				{ length: 50 },
				(_, j) => `q_${i}_${j}`,
			);
		}
		const result = generateBalancedExam(subjects, 35);
		expect(result).toHaveLength(35);
	});

	it("draws from multiple subjects (balanced)", () => {
		const subjects: Record<string, string[]> = {};
		for (let i = 0; i < 15; i++) {
			subjects[`subject_${i}`] = Array.from(
				{ length: 50 },
				(_, j) => `q_${i}_${j}`,
			);
		}
		const result = generateBalancedExam(subjects, 35);

		// Count how many subjects are represented
		const representedSubjects = new Set(
			result.map((id) => id.split("_").slice(0, 2).join("_")),
		);
		// With 35 questions across 15 subjects, at least 15 should be represented
		// (round-robin gives 2 per subject for first 30, then 5 more)
		expect(representedSubjects.size).toBe(15);
	});

	it("handles subjects with fewer questions than needed", () => {
		const subjects: Record<string, string[]> = {
			subject_a: ["q1", "q2"],
			subject_b: ["q3", "q4", "q5"],
		};
		const result = generateBalancedExam(subjects, 5);
		expect(result).toHaveLength(5);
	});

	it("returns no duplicates", () => {
		const subjects: Record<string, string[]> = {};
		for (let i = 0; i < 15; i++) {
			subjects[`subject_${i}`] = Array.from(
				{ length: 50 },
				(_, j) => `q_${i}_${j}`,
			);
		}
		const result = generateBalancedExam(subjects, 35);
		const unique = new Set(result);
		expect(unique.size).toBe(35);
	});
});
