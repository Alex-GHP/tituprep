"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { submitExamAttempt } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Clock, Send, BookOpen } from "lucide-react";

interface QuestionData {
	id: string;
	questionEn: string;
	questionRo: string;
	correctAnswerEn: string;
	correctAnswerRo: string;
	wrongAnswersEn: string[];
	wrongAnswersRo: string[];
	explanationEn: string | null;
	explanationRo: string | null;
	subjectId: string;
}

interface ExamPageProps {
	examId: string;
	examType: "standard" | "subject" | "random";
	examTitleEn: string;
	examTitleRo: string;
	questions: QuestionData[];
}

function formatTime(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/**
 * Deterministic shuffle based on a seed string.
 * Each question gets a stable option order per session.
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
		const j = ((hash >>> 0) % (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

/**
 * Parse markdown code fences in question text into text + code parts.
 */
function parseQuestionContent(text: string): {
	textParts: string[];
	codeBlocks: { lang: string; code: string }[];
} {
	const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
	const textParts: string[] = [];
	const codeBlocks: { lang: string; code: string }[] = [];

	let lastIndex = 0;
	let match = codeBlockRegex.exec(text);
	while (match !== null) {
		textParts.push(text.slice(lastIndex, match.index));
		codeBlocks.push({ lang: match[1] || "text", code: match[2].trim() });
		lastIndex = match.index + match[0].length;
		match = codeBlockRegex.exec(text);
	}
	textParts.push(text.slice(lastIndex));

	return { textParts, codeBlocks };
}

export function ExamPage({
	examId,
	examType,
	examTitleEn,
	examTitleRo,
	questions,
}: ExamPageProps) {
	const router = useRouter();
	const { t, language } = useLanguage();

	const isTimedExam = examType === "standard" || examType === "random";

	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<(number | null)[]>(
		new Array(questions.length).fill(null),
	);
	const [studyMode, setStudyMode] = useState(examType === "subject");
	const [timeLeft, setTimeLeft] = useState(questions.length * 90);
	const [startTime] = useState(Date.now());
	const [submitting, setSubmitting] = useState(false);

	// Build shuffled options per question (stable for the session)
	const shuffledQuestions = useMemo(() => {
		return questions.map((q) => {
			const correctEn = q.correctAnswerEn;
			const correctRo = q.correctAnswerRo;
			const allOptionsEn = [...q.wrongAnswersEn, correctEn];
			const allOptionsRo = [...q.wrongAnswersRo, correctRo];

			// Use question ID as seed for consistent shuffle
			const indices = seededShuffle(
				allOptionsEn.map((_, i) => i),
				q.id,
			);

			const shuffledEn = indices.map((i) => allOptionsEn[i]);
			const shuffledRo = indices.map((i) => allOptionsRo[i]);
			const correctIndex = indices.indexOf(allOptionsEn.length - 1); // correct was appended last

			return {
				...q,
				optionsEn: shuffledEn,
				optionsRo: shuffledRo,
				correctIndex,
			};
		});
	}, [questions]);

	const question = shuffledQuestions[currentIndex];
	const totalQuestions = questions.length;
	const unansweredCount = answers.filter((a) => a === null).length;
	const progressValue = ((currentIndex + 1) / totalQuestions) * 100;

	// Timer
	useEffect(() => {
		if (studyMode || !isTimedExam) return;
		if (timeLeft <= 0) {
			handleSubmit();
			return;
		}
		const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
		return () => clearInterval(interval);
	}, [timeLeft, studyMode, isTimedExam]);

	const selectAnswer = (optionIndex: number) => {
		setAnswers((prev) => {
			const next = [...prev];
			next[currentIndex] = optionIndex;
			return next;
		});
	};

	const handleSubmit = useCallback(async () => {
		if (submitting) return;
		setSubmitting(true);

		const timeTaken = Math.floor((Date.now() - startTime) / 1000);

		const answerRecords = shuffledQuestions.map((q, i) => ({
			questionId: q.id,
			selectedIndex: answers[i],
			correct: answers[i] === q.correctIndex,
		}));

		const attemptId = await submitExamAttempt({
			examId,
			answers: answerRecords,
			timeTakenSeconds: timeTaken,
		});

		if (attemptId) {
			router.push(`/results/${attemptId}`);
		} else {
			setSubmitting(false);
		}
	}, [answers, shuffledQuestions, examId, submitting, startTime, router]);

	if (!question) return null;

	const questionText =
		language === "en" ? question.questionEn : question.questionRo;
	const options =
		language === "en" ? question.optionsEn : question.optionsRo;
	const { textParts, codeBlocks } = parseQuestionContent(questionText);

	return (
		<main className="mx-auto max-w-3xl px-4 py-6 md:py-10">
			{/* Top bar */}
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<span className="text-sm font-medium text-muted-foreground">
						{t("exam.question")} {currentIndex + 1} {t("exam.of")}{" "}
						{totalQuestions}
					</span>
					{isTimedExam && !studyMode && (
						<div className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5">
							<Clock className="h-4 w-4 text-primary" />
							<span
								className={`text-sm font-mono font-semibold ${timeLeft < 60 ? "text-destructive" : "text-foreground"}`}
							>
								{formatTime(timeLeft)}
							</span>
						</div>
					)}
				</div>
				<div className="flex items-center gap-2">
					<BookOpen className="h-4 w-4 text-muted-foreground" />
					<Label
						htmlFor="study-toggle"
						className="text-sm text-muted-foreground cursor-pointer"
					>
						{t("exam.studyMode")}
					</Label>
					<Switch
						id="study-toggle"
						checked={studyMode}
						onCheckedChange={setStudyMode}
					/>
				</div>
			</div>

			{/* Progress */}
			<Progress value={progressValue} className="mb-6 h-2" />

			{/* Question navigation pills */}
			<div className="mb-6 flex flex-wrap gap-1.5">
				{questions.map((_, i) => (
					<button
						key={`nav-${questions[i].id}`}
						type="button"
						onClick={() => setCurrentIndex(i)}
						className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors
              ${
								i === currentIndex
									? "bg-primary text-primary-foreground"
									: answers[i] !== null
										? "bg-primary/20 text-primary"
										: "bg-secondary text-muted-foreground hover:bg-accent"
							}`}
						aria-label={`Question ${i + 1}`}
					>
						{i + 1}
					</button>
				))}
			</div>

			{/* Question Card */}
			<Card className="bg-card border-border">
				<CardContent className="p-6">
					{/* Render question text with inline code blocks */}
					{textParts.map((part, idx) => (
						<span key={`text-${question.id}-${idx}`}>
							{part.trim() && (
								<p className="text-base font-medium leading-relaxed text-card-foreground whitespace-pre-wrap">
									{part.trim()}
								</p>
							)}
							{codeBlocks[idx] && (
								<pre className="mt-4 mb-4 overflow-x-auto rounded-lg bg-secondary p-4 text-sm font-mono leading-relaxed text-foreground">
									<code>{codeBlocks[idx].code}</code>
								</pre>
							)}
						</span>
					))}

					<RadioGroup
						className="mt-6 flex flex-col gap-3"
						value={answers[currentIndex]?.toString() ?? ""}
						onValueChange={(val) => selectAnswer(Number.parseInt(val))}
					>
						{options.map((option, optIdx) => {
							const optionContent = parseQuestionContent(option);
							const hasCode = optionContent.codeBlocks.length > 0;

							return (
								<Label
									key={`opt-${question.id}-${optIdx}`}
									htmlFor={`option-${optIdx}`}
									className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors
                    ${
											answers[currentIndex] === optIdx
												? "border-primary bg-primary/5 text-foreground"
												: "border-border bg-background text-foreground hover:border-primary/30 hover:bg-secondary"
										}`}
								>
									<RadioGroupItem
										value={optIdx.toString()}
										id={`option-${optIdx}`}
										className="mt-0.5"
									/>
									{hasCode ? (
										<div className="flex-1">
											{optionContent.textParts.map((part, pIdx) => (
												<span key={`opttext-${question.id}-${optIdx}-${pIdx}`}>
													{part.trim() && (
														<span className="text-sm">{part.trim()}</span>
													)}
													{optionContent.codeBlocks[pIdx] && (
														<pre className="mt-1 mb-1 overflow-x-auto rounded bg-secondary p-2 text-xs font-mono leading-relaxed text-foreground">
															<code>
																{optionContent.codeBlocks[pIdx].code}
															</code>
														</pre>
													)}
												</span>
											))}
										</div>
									) : (
										<span className="text-sm">{option}</span>
									)}
								</Label>
							);
						})}
					</RadioGroup>
				</CardContent>
			</Card>

			{/* Navigation */}
			<div className="mt-6 flex items-center justify-between">
				<Button
					variant="outline"
					onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
					disabled={currentIndex === 0}
					className="gap-2 border-border text-foreground"
				>
					<ChevronLeft className="h-4 w-4" />
					{t("exam.previous")}
				</Button>

				{currentIndex < totalQuestions - 1 ? (
					<Button
						onClick={() =>
							setCurrentIndex((prev) =>
								Math.min(totalQuestions - 1, prev + 1),
							)
						}
						className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
					>
						{t("exam.next")}
						<ChevronRight className="h-4 w-4" />
					</Button>
				) : (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
								disabled={submitting}
							>
								<Send className="h-4 w-4" />
								{t("exam.submit")}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent className="bg-card text-card-foreground border-border">
							<AlertDialogHeader>
								<AlertDialogTitle className="text-foreground">
									{t("exam.confirmSubmit")}
								</AlertDialogTitle>
								<AlertDialogDescription className="text-muted-foreground">
									{unansweredCount > 0
										? `${unansweredCount} ${t("exam.unanswered")}.`
										: ""}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="border-border text-foreground">
									{t("exam.cancel")}
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleSubmit}
									className="bg-primary text-primary-foreground"
									disabled={submitting}
								>
									{t("exam.submit")}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}
			</div>
		</main>
	);
}
