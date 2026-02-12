"use client"

import { useApp } from "@/lib/app-store"
import { useLanguage } from "@/lib/language-context"
import { sampleQuestions, generateExam } from "@/lib/exam-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  LayoutDashboard,
} from "lucide-react"

function ScoreGauge({ score }: { score: number }) {
  const percentage = (score / 10) * 100
  const circumference = 2 * Math.PI * 45
  const filled = (percentage / 100) * circumference
  const color =
    score >= 8
      ? "hsl(var(--success))"
      : score >= 5
        ? "hsl(var(--chart-4))"
        : "hsl(var(--destructive))"

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 100 100" className="-rotate-90">
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
        <span className="text-3xl font-bold text-foreground">{score.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">/10</span>
      </div>
    </div>
  )
}

export function ResultsPage() {
  const {
    examResult,
    examQuestions,
    currentExamId,
    setCurrentPage,
    setExamQuestions,
    setExamResult,
  } = useApp()
  const { t } = useLanguage()

  if (!examResult) return null

  const correctCount = examResult.answers.filter((a) => a.correct).length
  const incorrectCount = examResult.total - correctCount

  const handleRetake = () => {
    setExamResult(null)
    if (currentExamId) {
      setExamQuestions(generateExam(currentExamId))
    }
    setCurrentPage("exam")
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t("results.title")}</h1>

      {/* Score Card */}
      <Card className="mt-6 bg-card border-border">
        <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-between">
          <ScoreGauge score={examResult.score} />
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <h2 className="text-lg font-semibold text-card-foreground">{t("results.score")}</h2>
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
              <Button variant="outline" onClick={handleRetake} className="gap-2 border-border text-foreground">
                <RotateCcw className="h-4 w-4" />
                {t("results.retake")}
              </Button>
              <Button
                onClick={() => setCurrentPage("dashboard")}
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
      <h2 className="mt-10 mb-4 text-lg font-semibold text-foreground">{t("results.review")}</h2>
      <Accordion type="multiple" className="flex flex-col gap-3">
        {examResult.answers.map((answer, idx) => {
          const q = examQuestions[idx]
          if (!q) return null
          return (
            <AccordionItem key={idx} value={`q-${idx}`} className="border-none">
              <Card className={`border ${answer.correct ? "border-[hsl(var(--success))]/30" : "border-destructive/30"} bg-card`}>
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    {answer.correct ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[hsl(var(--success))]" />
                    ) : (
                      <XCircle className="h-5 w-5 shrink-0 text-destructive" />
                    )}
                    <span className="text-sm font-medium text-card-foreground">
                      {t("exam.question")} {idx + 1}: {q.text}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  {q.code && (
                    <pre className="mb-4 overflow-x-auto rounded-lg bg-secondary p-3 text-sm font-mono text-foreground">
                      <code>{q.code}</code>
                    </pre>
                  )}
                  <div className="flex flex-col gap-2">
                    {answer.selectedIndex !== null && (
                      <div className="flex items-center gap-2">
                        <Badge variant={answer.correct ? "default" : "destructive"} className="text-xs">
                          {t("results.yourAnswer")}
                        </Badge>
                        <span className="text-sm text-foreground">{q.options[answer.selectedIndex]}</span>
                      </div>
                    )}
                    {!answer.correct && (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] text-xs">
                          {t("results.correctAnswer")}
                        </Badge>
                        <span className="text-sm text-foreground">{q.options[q.correctIndex]}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 rounded-lg bg-secondary p-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">{t("results.explanation")}</p>
                    <p className="text-sm leading-relaxed text-foreground">{q.explanation}</p>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          )
        })}
      </Accordion>
    </main>
  )
}
