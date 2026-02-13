/**
 * Detects figure references in question text and returns the matching image URL.
 * Questions reference figures as "Fig. 1", "Fig 1", "Fig. 2", etc.
 * Images are stored in the Supabase "tituprep" bucket under /questions/.
 *
 * NOTE: Figure numbers in question text are per-subject, NOT global.
 * DSA "Fig. 1" (binary tree) maps to fig3.jpg in the bucket,
 * while web technologies "Fig 1" (SVG diagram) maps to fig1.png.
 */

const STORAGE_BASE =
	"https://yelritsuffubrssyujmu.supabase.co/storage/v1/object/public/tituprep/questions";

/** DSA subject: figure numbers → bucket filenames */
const DSA_FIGURE_MAP: Record<string, string> = {
	"1": `${STORAGE_BASE}/fig3.jpg`,
	"2": `${STORAGE_BASE}/fig2.png`,
	"3": `${STORAGE_BASE}/fig3.jpg`,
	"4": `${STORAGE_BASE}/fig4.jpg`,
};

/** Web technologies subject: figure numbers → bucket filenames */
const WEB_FIGURE_MAP: Record<string, string> = {
	"1": `${STORAGE_BASE}/fig1.png`,
};

// Matches "Fig. 1", "Fig 1", "Fig.1", "Fig. 3", "figura 2", case-insensitive
const FIGURE_REGEX = /\bfig[ura]*[.\s]*([1-4])\b/i;

/**
 * Scans both RO and EN question text for a figure reference (Fig. 1–4)
 * and returns the corresponding image URL based on the subject,
 * or null if none found.
 */
export function getQuestionImageUrl(
	questionTextEn: string,
	questionTextRo: string,
	subjectId: string,
): string | null {
	const match =
		FIGURE_REGEX.exec(questionTextRo) ?? FIGURE_REGEX.exec(questionTextEn);
	if (!match) return null;

	const figNum = match[1];

	if (subjectId === "tehnologii_web") {
		return WEB_FIGURE_MAP[figNum] ?? null;
	}

	// Default to DSA figure map (all current figure references are from DSA)
	return DSA_FIGURE_MAP[figNum] ?? null;
}
