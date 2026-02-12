"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { generateRandomExam } from "@/lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	FileText,
	GraduationCap,
	Shuffle,
	Play,
	Award,
	BookOpen,
} from "lucide-react";

interface StandardExam {
	id: string;
	examNumber: number;
	titleEn: string;
	titleRo: string;
	bestScore: number | null;
	questionCount: number;
}

interface SubjectExam {
	id: string;
	subjectId: string;
	nameEn: string;
	nameRo: string;
	module: string | null;
	bestScore: number | null;
	questionCount: number;
}

interface DashboardPageProps {
	standardExams: StandardExam[];
	subjectExams: SubjectExam[];
}

export function DashboardPage({
	standardExams,
	subjectExams,
}: DashboardPageProps) {
	const router = useRouter();
	const { t, language } = useLanguage();

	const startExam = (examId: string) => {
		router.push(`/exam/${examId}`);
	};

	const handleGenerateRandom = async () => {
		const examId = await generateRandomExam();
		if (examId) {
			router.push(`/exam/${examId}`);
		}
	};

	return (
		<main className="mx-auto max-w-6xl px-4 py-8">
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground md:text-3xl">
						{t("dash.title")}
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{t("dash.subtitle")}
					</p>
				</div>
				<Button
					onClick={handleGenerateRandom}
					className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
				>
					<Shuffle className="h-4 w-4" />
					{t("dash.generateRandom")}
				</Button>
			</div>

			<Tabs defaultValue="exams" className="w-full">
				<TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="exams" className="gap-2">
						<FileText className="h-4 w-4" />
						{t("dash.fullExams")}
					</TabsTrigger>
					<TabsTrigger value="subjects" className="gap-2">
						<GraduationCap className="h-4 w-4" />
						{t("dash.subjectTraining")}
					</TabsTrigger>
				</TabsList>

				{/* Exams Grid */}
				<TabsContent value="exams">
					<div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{standardExams.map((exam) => (
							<Card
								key={exam.id}
								className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-md"
								onClick={() => startExam(exam.id)}
							>
								<CardContent className="flex flex-col items-center gap-3 p-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
										<FileText className="h-5 w-5" />
									</div>
									<div className="text-center">
										<p className="font-semibold text-card-foreground text-sm">
											{t("dash.exam")} #{exam.examNumber}
										</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											{exam.questionCount} {t("dash.questions")}
										</p>
										<div className="mt-1.5">
											{exam.bestScore !== null ? (
												<Badge
													variant="secondary"
													className="gap-1 text-xs"
												>
													<Award className="h-3 w-3" />
													{exam.bestScore.toFixed(1)}
												</Badge>
											) : (
												<span className="text-xs text-muted-foreground">
													{t("dash.notAttempted")}
												</span>
											)}
										</div>
									</div>
									<Button
										variant="ghost"
										size="sm"
										className="w-full mt-1 h-8 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
									>
										<Play className="h-3 w-3" />
										{t("dash.startExam")}
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Subjects Grid */}
				<TabsContent value="subjects">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{subjectExams.map((subject) => (
							<Card
								key={subject.id}
								className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-md"
								onClick={() => startExam(subject.id)}
							>
								<CardContent className="flex flex-col gap-3 p-5">
									<div className="flex items-start justify-between">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
											<BookOpen className="h-5 w-5" />
										</div>
										{subject.bestScore !== null && (
											<Badge
												variant="secondary"
												className="gap-1 text-xs"
											>
												<Award className="h-3 w-3" />
												{subject.bestScore.toFixed(1)}
											</Badge>
										)}
									</div>
									<div>
										<h3 className="font-semibold text-card-foreground text-sm leading-snug">
											{language === "en"
												? subject.nameEn
												: subject.nameRo}
										</h3>
										<p className="mt-1 text-xs text-muted-foreground">
											{subject.questionCount} {t("dash.questions")}
										</p>
									</div>
									<Button
										variant="ghost"
										size="sm"
										className="w-full h-8 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
									>
										<Play className="h-3 w-3" />
										{t("dash.startTraining")}
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</main>
	);
}
