"use client"

import { useState, useEffect, useCallback } from "react"
import { useApp } from "@/lib/app-store"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
} from "@/components/ui/alert-dialog"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Send,
  BookOpen,
} from "lucide-react"
import type { ExamResult } from "@/lib/exam-data"

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export function ExamPage() {
  const {
    examQuestions,
    examMode,
    currentExamId,
    studyMode,
    setStudyMode,
    setExamResult,
    setCurrentPage,
  } = useApp()
  const { t } = useLanguage()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(examQuestions.length).fill(null)
  )
  const [timeLeft, setTimeLeft] = useState(examQuestions.length * 90) // 90 seconds per question

  const isExam = examMode === "exam"
  const question = examQuestions[currentIndex]
  const totalQuestions = examQuestions.length
  const unansweredCount = answers.filter((a) => a === null).length
  const progressValue = ((currentIndex + 1) / totalQuestions) * 100

  // Timer
  useEffect(() => {
    if (studyMode || !isExam) return
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timeLeft, studyMode, isExam])

  const selectAnswer = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = optionIndex
      return next
    })
  }

  const handleSubmit = useCallback(() => {
    const result: ExamResult = {
      examId: currentExamId ?? 0,
      score: 0,
      total: totalQuestions,
      answers: examQuestions.map((q, i) => ({
        questionId: q.id,
        selectedIndex: answers[i],
        correct: answers[i] === q.correctIndex,
      })),
      date: new Date().toISOString(),
    }
    const correctCount = result.answers.filter((a) => a.correct).length
    result.score = Math.round((correctCount / totalQuestions) * 10 * 10) / 10
    setExamResult(result)
    setCurrentPage("results")
  }, [answers, examQuestions, currentExamId, totalQuestions, setExamResult, setCurrentPage])

  if (!question) return null

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            {t("exam.question")} {currentIndex + 1} {t("exam.of")} {totalQuestions}
          </span>
          {isExam && !studyMode && (
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span className={`text-sm font-mono font-semibold ${timeLeft < 60 ? "text-destructive" : "text-foreground"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>
        {isExam && (
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="study-toggle" className="text-sm text-muted-foreground cursor-pointer">
              {t("exam.studyMode")}
            </Label>
            <Switch
              id="study-toggle"
              checked={studyMode}
              onCheckedChange={setStudyMode}
            />
          </div>
        )}
      </div>

      {/* Progress */}
      <Progress value={progressValue} className="mb-6 h-2" />

      {/* Question navigation pills */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {examQuestions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors
              ${i === currentIndex
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
          <p className="text-base font-medium leading-relaxed text-card-foreground">
            {question.text}
          </p>
          {question.code && (
            <pre className="mt-4 overflow-x-auto rounded-lg bg-secondary p-4 text-sm font-mono leading-relaxed text-foreground">
              <code>{question.code}</code>
            </pre>
          )}

          <RadioGroup
            className="mt-6 flex flex-col gap-3"
            value={answers[currentIndex]?.toString() ?? ""}
            onValueChange={(val) => selectAnswer(parseInt(val))}
          >
            {question.options.map((option, optIdx) => (
              <Label
                key={optIdx}
                htmlFor={`option-${optIdx}`}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors
                  ${answers[currentIndex] === optIdx
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/30 hover:bg-secondary"
                  }`}
              >
                <RadioGroupItem value={optIdx.toString()} id={`option-${optIdx}`} />
                <span className="text-sm">{option}</span>
              </Label>
            ))}
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
            onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {t("exam.next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="h-4 w-4" />
                {t("exam.submit")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card text-card-foreground border-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">{t("exam.confirmSubmit")}</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  {unansweredCount > 0
                    ? `${unansweredCount} ${t("exam.unanswered")}.`
                    : ""}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-border text-foreground">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit} className="bg-primary text-primary-foreground">
                  {t("exam.submit")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </main>
  )
}
