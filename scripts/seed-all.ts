/**
 * Master seeding script.
 * Run with: pnpm db:seed
 *
 * Order matters for FK constraints:
 * 1. Subjects (referenced by questions and exams)
 * 2. Practice exams (inserts questions + standard exams)
 * 3. Subject exams (inserts questions + subject exams)
 */

import { seedSubjects } from "./seed-subjects";
import { seedPracticeExams } from "./seed-practice-exams";
import { seedSubjectExams } from "./seed-subject-exams";

async function main() {
	console.log("=== TituPrep Database Seeder ===\n");

	const start = Date.now();

	await seedSubjects();
	console.log();

	await seedPracticeExams();
	console.log();

	await seedSubjectExams();
	console.log();

	const elapsed = ((Date.now() - start) / 1000).toFixed(1);
	console.log(`=== Seeding complete in ${elapsed}s ===`);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error("Seeding failed:", err);
		process.exit(1);
	});
