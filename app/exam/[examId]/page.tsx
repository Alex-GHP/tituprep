import { notFound } from "next/navigation";
import { ExamPage } from "@/components/exam-page";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
	params: Promise<{ examId: string }>;
}

export default async function Page({ params }: PageProps) {
	const { examId } = await params;
	const supabase = await createClient();

	// Fetch exam info
	const { data: exam } = await supabase
		.from("exams")
		.select("*")
		.eq("id", examId)
		.single();

	if (!exam) notFound();

	// Fetch questions for this exam, ordered by position
	const { data: examQuestions } = await supabase
		.from("exam_questions")
		.select("position, question_id, questions(*)")
		.eq("exam_id", examId)
		.order("position");

	if (!examQuestions || examQuestions.length === 0) notFound();

	const questions = examQuestions.map((eq) => {
		const q = eq.questions as unknown as {
			id: string;
			question_en: string;
			question_ro: string;
			correct_answer_en: string;
			correct_answer_ro: string;
			wrong_answers_en: string[];
			wrong_answers_ro: string[];
			explanation_en: string | null;
			explanation_ro: string | null;
			subject_id: string;
		};
		return {
			id: q.id,
			questionEn: q.question_en,
			questionRo: q.question_ro,
			correctAnswerEn: q.correct_answer_en,
			correctAnswerRo: q.correct_answer_ro,
			wrongAnswersEn: q.wrong_answers_en,
			wrongAnswersRo: q.wrong_answers_ro,
			explanationEn: q.explanation_en,
			explanationRo: q.explanation_ro,
			subjectId: q.subject_id,
		};
	});

	return (
		<ExamPage
			examId={exam.id}
			examType={exam.type as "standard" | "subject" | "random"}
			examTitleEn={exam.title_en ?? `Exam #${exam.exam_number}`}
			examTitleRo={exam.title_ro ?? `Examen #${exam.exam_number}`}
			questions={questions}
		/>
	);
}
