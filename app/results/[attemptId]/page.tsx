import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResultsPage } from "@/components/results-page";

interface PageProps {
	params: Promise<{ attemptId: string }>;
}

export default async function Page({ params }: PageProps) {
	const { attemptId } = await params;
	const supabase = await createClient();

	// Fetch the attempt
	const { data: attempt } = await supabase
		.from("user_attempts")
		.select("*")
		.eq("id", attemptId)
		.single();

	if (!attempt) notFound();

	// Fetch the exam info
	const { data: exam } = await supabase
		.from("exams")
		.select("*")
		.eq("id", attempt.exam_id)
		.single();

	if (!exam) notFound();

	// Fetch exam questions in order
	const { data: examQuestions } = await supabase
		.from("exam_questions")
		.select("position, question_id, questions(*)")
		.eq("exam_id", attempt.exam_id)
		.order("position");

	const questions = (examQuestions ?? []).map((eq) => {
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

	const answers = attempt.answers as unknown as {
		questionId: string;
		selectedIndex: number | null;
		correct: boolean;
	}[];

	return (
		<ResultsPage
			attemptId={attempt.id}
			examId={exam.id}
			examType={exam.type as "standard" | "subject" | "random"}
			examTitleEn={exam.title_en ?? `Exam #${exam.exam_number}`}
			examTitleRo={exam.title_ro ?? `Examen #${exam.exam_number}`}
			score={Number(attempt.score)}
			totalQuestions={attempt.total_questions}
			correctCount={attempt.correct_count}
			answers={answers}
			questions={questions}
		/>
	);
}
