"use client"

import { useMemo } from "react"
import { useApp } from "@/lib/app-store"
import { useLanguage } from "@/lib/language-context"
import { subjects, getExamScores, generateExam, generateSubjectQuestions } from "@/lib/exam-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  GraduationCap,
  Shuffle,
  Play,
  Award,
  BookOpen,
} from "lucide-react"

export function DashboardPage() {
  const {
    setCurrentPage,
    setExamMode,
    setCurrentExamId,
    setCurrentSubjectId,
    setExamQuestions,
    setStudyMode,
  } = useApp()
  const { t, language } = useLanguage()

  const examScores = useMemo(() => getExamScores(), [])

  const startExam = (examId: number) => {
    setExamMode("exam")
    setCurrentExamId(examId)
    setCurrentSubjectId(null)
    setExamQuestions(generateExam(examId))
    setStudyMode(false)
    setCurrentPage("exam")
  }

  const startTraining = (subjectId: string) => {
    setExamMode("training")
    setCurrentSubjectId(subjectId)
    setCurrentExamId(null)
    setExamQuestions(generateSubjectQuestions(subjectId))
    setStudyMode(true)
    setCurrentPage("exam")
  }

  const generateRandom = () => {
    const randomId = Math.floor(Math.random() * 20) + 1
    startExam(randomId)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t("dash.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {language === "en" ? "Select an exam or subject to begin practicing." : "Selecteaza un examen sau o materie pentru a incepe."}
          </p>
        </div>
        <Button onClick={generateRandom} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
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
            {examScores.map((exam) => (
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
                      {t("dash.exam")} #{exam.id}
                    </p>
                    <div className="mt-1.5">
                      {exam.bestScore !== null ? (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Award className="h-3 w-3" />
                          {exam.bestScore.toFixed(1)}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">{t("dash.notAttempted")}</span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-1 h-8 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
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
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-md"
                onClick={() => startTraining(subject.id)}
              >
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    {subject.bestScore !== null && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Award className="h-3 w-3" />
                        {subject.bestScore.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground text-sm leading-snug">
                      {subject.name[language]}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {subject.questionCount} {t("dash.questions")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={subject.progress} className="h-1.5 flex-1" />
                    <span className="text-xs font-medium text-muted-foreground">{subject.progress}%</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full h-8 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
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
  )
}
