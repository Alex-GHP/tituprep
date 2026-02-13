/**
 * Seed the subjects table from both JSON files.
 * Uses the canonical (longer) slug from questions.json.
 */

import { supabase } from "./supabase-admin";

// Canonical subject definitions with human-readable names
const SUBJECTS: {
	id: string;
	name_en: string;
	name_ro: string;
	module: string | null;
}[] = [
	{
		id: "fundamentele_programarii",
		name_en: "Programming Fundamentals",
		name_ro: "Fundamentele Programarii",
		module: "module1",
	},
	{
		id: "programare_python",
		name_en: "Python Programming",
		name_ro: "Programare Python",
		module: "module1",
	},
	{
		id: "oop",
		name_en: "Object-Oriented Programming",
		name_ro: "Programare Orientata pe Obiecte",
		module: "module1",
	},
	{
		id: "metode_avansate_de_programare_java",
		name_en: "Advanced Java Programming Methods",
		name_ro: "Metode Avansate de Programare Java",
		module: "module1",
	},
	{
		id: "tehnici_avansate_de_programare",
		name_en: "Advanced Programming Techniques",
		name_ro: "Tehnici Avansate de Programare",
		module: "module1",
	},
	{
		id: "dsa",
		name_en: "Data Structures & Algorithms",
		name_ro: "Structuri de Date si Algoritmi",
		module: "module1",
	},
	{
		id: "baze_de_date",
		name_en: "Databases",
		name_ro: "Baze de Date",
		module: "module2",
	},
	{
		id: "sisteme_de_gestiune_baze_de_date",
		name_en: "Database Management Systems",
		name_ro: "Sisteme de Gestiune Baze de Date",
		module: "module2",
	},
	{
		id: "sisteme_de_operare",
		name_en: "Operating Systems",
		name_ro: "Sisteme de Operare",
		module: "module3",
	},
	{
		id: "retele_de_calculatoare",
		name_en: "Computer Networks",
		name_ro: "Retele de Calculatoare",
		module: "module3",
	},
	{
		id: "criptografie",
		name_en: "Cryptography",
		name_ro: "Criptografie",
		module: "module3",
	},
	{
		id: "tehnologii_web",
		name_en: "Web Technologies",
		name_ro: "Tehnologii Web",
		module: "module4",
	},
	{
		id: "comert_electronic",
		name_en: "E-Commerce",
		name_ro: "Comert Electronic",
		module: "module4",
	},
	{
		id: "cloud_computing",
		name_en: "Cloud Computing",
		name_ro: "Cloud Computing",
		module: "module4",
	},
	{
		id: "inovare_transformare_digitala",
		name_en: "Digital Innovation & Transformation",
		name_ro: "Inovare si Transformare Digitala",
		module: "module4",
	},
];

/**
 * Map short slugs from practice_exams.json to canonical IDs
 */
export const SLUG_NORMALIZATION: Record<string, string> = {
	metode_avansate_java: "metode_avansate_de_programare_java",
	tehnici_avansate_prog: "tehnici_avansate_de_programare",
	sisteme_gestiune_bd: "sisteme_de_gestiune_baze_de_date",
	inovare_digitala: "inovare_transformare_digitala",
};

export function normalizeSubjectSlug(slug: string): string {
	return SLUG_NORMALIZATION[slug] ?? slug;
}

export async function seedSubjects() {
	console.log("Seeding subjects...");

	const { error } = await supabase
		.from("subjects")
		.upsert(SUBJECTS, { onConflict: "id" });

	if (error) {
		console.error("Error seeding subjects:", error);
		throw error;
	}

	console.log(`  Seeded ${SUBJECTS.length} subjects.`);
}

// Run directly if this script is the entry point
if (process.argv[1]?.endsWith("seed-subjects.ts")) {
	seedSubjects()
		.then(() => {
			console.log("Done!");
			process.exit(0);
		})
		.catch(() => process.exit(1));
}
