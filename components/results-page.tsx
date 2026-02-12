"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	CheckCircle2,
	XCircle,
	RotateCcw,
	LayoutDashboard,
} from "lucide-react";

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

interface AnswerData {
	questionId: string;
	selectedIndex: number | null;
	correct: boolean;
}

interface ResultsPageProps {
	attemptId: string;
	examId: string;
	examType: "standard" | "subject" | "random";
	examTitleEn: string;
	examTitleRo: string;
	score: number;
	totalQuestions: number;
	correctCount: number;
	answers: AnswerData[];
	questions: QuestionData[];
}

/**
 * Deterministic shuffle matching the exam page's shuffle
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

function ScoreGauge({ score }: { score: number }) {
	const percentage = (score / 10) * 100;
	const circumference = 2 * Math.PI * 45;
	const filled = (percentage / 100) * circumference;
	const color =
		score >= 8
			? "hsl(var(--success))"
			: score >= 5
				? "hsl(var(--chart-4))"
				: "hsl(var(--destructive))";

	return (
		<div className="relative flex items-center justify-center">
			<svg
				width="140"
				height="140"
				viewBox="0 0 100 100"
				className="-rotate-90"
			>
				<circle
					cx="50"
					cy="50"
					r="45"
					fill="none"
					stroke="hsl(var(--border))"
					strokeWidth="8"
				/>
				<circle
					cx="50"
					cy="50"
					r="45"
					fill="none"
					stroke={color}
					strokeWidth="8"
					strokeDasharray={circumference}
					strokeDashoffset={circumference - filled}
					strokeLinecap="round"
					className="transition-all duration-1000 ease-out"
				/>
			</svg>
			<div className="absolute flex flex-col items-center">
				<span className="text-3xl font-bold text-foreground">
					{score.toFixed(1)}
				</span>
				<span className="text-xs text-muted-foreground">/10</span>
			</div>
		</div>
	);
}

export function ResultsPage({
	attemptId,
	examId,
	examType,
	examTitleEn,
	examTitleRo,
	score,
	totalQuestions,
	correctCount,
	answers,
	questions,
}: ResultsPageProps) {
	const router = useRouter();
	const { t, language } = useLanguage();

	const incorrectCount = totalQuestions - correctCount;

	const handleRetake = () => {
		router.push(`/exam/${examId}`);
	};

	return (
		<main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
			<h1 className="text-2xl font-bold text-foreground md:text-3xl">
				{t("results.title")}
			</h1>

			{/* Score Card */}
			<Card className="mt-6 bg-card border-border">
				<CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-between">
					<ScoreGauge score={score} />
					<div className="flex flex-col items-center gap-4 sm:items-start">
						<h2 className="text-lg font-semibold text-card-foreground">
							{t("results.score")}
						</h2>
						<div className="flex gap-4">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
								<span className="text-sm text-foreground">
									{correctCount} {t("results.correct")}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<XCircle className="h-5 w-5 text-destructive" />
								<span className="text-sm text-foreground">
									{incorrectCount} {t("results.incorrect")}
								</span>
							</div>
						</div>
						<div className="flex gap-3">
							<Button
								variant="outline"
								onClick={handleRetake}
								className="gap-2 border-border text-foreground"
							>
								<RotateCcw className="h-4 w-4" />
								{t("results.retake")}
							</Button>
							<Button
								onClick={() => router.push("/dashboard")}
								className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
							>
								<LayoutDashboard className="h-4 w-4" />
								{t("results.backToDashboard")}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Review */}
			<h2 className="mt-10 mb-4 text-lg font-semibold text-foreground">
				{t("results.review")}
			</h2>
			<Accordion type="multiple" className="flex flex-col gap-3">
				{answers.map((answer, idx) => {
					const q = questions[idx];
					if (!q) return null;

					const questionText =
						language === "en" ? q.questionEn : q.questionRo;
					const correctAnswer =
						language === "en"
							? q.correctAnswerEn
							: q.correctAnswerRo;
					const wrongAnswers =
						language === "en"
							? q.wrongAnswersEn
							: q.wrongAnswersRo;
					const explanation =
						language === "en"
							? q.explanationEn
							: q.explanationRo;

					// Reconstruct shuffled options to show what the user saw
					const allOptions = [...wrongAnswers, correctAnswer];
					const indices = seededShuffle(
						allOptions.map((_, i) => i),
						q.id,
					);
					const shuffledOptions = indices.map((i) => allOptions[i]);
					const correctIdx = indices.indexOf(allOptions.length - 1);

					const selectedOption =
						answer.selectedIndex !== null
							? shuffledOptions[answer.selectedIndex]
							: null;

					const { textParts, codeBlocks } =
						parseQuestionContent(questionText);

					return (
						<AccordionItem
							key={`review-${q.id}`}
							value={`q-${idx}`}
							className="border-none"
						>
							<Card
								className={`border ${answer.correct ? "border-[hsl(var(--success))]/30" : "border-destructive/30"} bg-card`}
							>
								<AccordionTrigger className="px-5 py-4 hover:no-underline">
									<div className="flex items-center gap-3 text-left">
										{answer.correct ? (
											<CheckCircle2 className="h-5 w-5 shrink-0 text-[hsl(var(--success))]" />
										) : (
											<XCircle className="h-5 w-5 shrink-0 text-destructive" />
										)}
										<span className="text-sm font-medium text-card-foreground">
											{t("exam.question")} {idx + 1}:{" "}
											{textParts[0]?.slice(0, 120)}
											{(textParts[0]?.length ?? 0) > 120 ? "..." : ""}
										</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className="px-5 pb-5">
									{/* Full question text with code */}
									{textParts.map((part, pIdx) => (
										<span key={`rtext-${q.id}-${pIdx}`}>
											{part.trim() && (
												<p className="text-sm leading-relaxed text-card-foreground whitespace-pre-wrap">
													{part.trim()}
												</p>
											)}
											{codeBlocks[pIdx] && (
												<pre className="mt-2 mb-2 overflow-x-auto rounded-lg bg-secondary p-3 text-sm font-mono text-foreground">
													<code>{codeBlocks[pIdx].code}</code>
												</pre>
											)}
										</span>
									))}

									<div className="mt-4 flex flex-col gap-2">
										{selectedOption !== null && (
											<div className="flex items-start gap-2">
												<Badge
													variant={
														answer.correct ? "default" : "destructive"
													}
													className="text-xs shrink-0 mt-0.5"
												>
													{t("results.yourAnswer")}
												</Badge>
												<span className="text-sm text-foreground">
													{selectedOption}
												</span>
											</div>
										)}
										{!answer.correct && (
											<div className="flex items-start gap-2">
												<Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] text-xs shrink-0 mt-0.5">
													{t("results.correctAnswer")}
												</Badge>
												<span className="text-sm text-foreground">
													{correctAnswer}
												</span>
											</div>
										)}
									</div>
									{explanation && (
										<div className="mt-3 rounded-lg bg-secondary p-3">
											<p className="text-xs font-medium text-muted-foreground uppercase mb-1">
												{t("results.explanation")}
											</p>
											<p className="text-sm leading-relaxed text-foreground">
												{explanation}
											</p>
										</div>
									)}
								</AccordionContent>
							</Card>
						</AccordionItem>
					);
				})}
			</Accordion>
		</main>
	);
}
