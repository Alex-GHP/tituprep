"use client"

import { useApp } from "@/lib/app-store"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Code2,
  Timer,
  BarChart3,
  ArrowRight,
  Github,
} from "lucide-react"

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
    </svg>
  )
}

export function LandingPage() {
  const { setAuthenticated, setCurrentPage } = useApp()
  const { t } = useLanguage()

  const handleAuth = () => {
    setAuthenticated(true)
    setCurrentPage("dashboard")
  }

  return (
    <main className="flex flex-col items-center">
      {/* Hero */}
      <section className="w-full px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <BookOpen className="h-4 w-4" />
            <span>Practice Exam Platform</span>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Button size="lg" onClick={handleAuth} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-base">
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full px-4 pb-16">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-start gap-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Timer className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Timed Exams</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Simulate real exam conditions with countdown timers and 20 practice exams.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-start gap-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Code Questions</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Practice with real code snippets and syntax-highlighted questions.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-start gap-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Track Progress</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Monitor your scores and progress across subjects and exams.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Developer Spotlight */}
      <section className="w-full px-4 pb-16">
        <div className="mx-auto max-w-2xl">
          <Card className="bg-card border-border">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-card-foreground">{t("hero.spotlight")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t("hero.spotlightDesc")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="mx-auto max-w-sm" />

      {/* Auth */}
      <section className="w-full px-4 py-16">
        <div className="mx-auto max-w-sm">
          <p className="mb-4 text-center text-sm text-muted-foreground">{t("auth.or")}</p>
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="gap-3 h-11 bg-card text-card-foreground border-border hover:bg-secondary" onClick={handleAuth}>
              <GoogleIcon />
              {t("auth.google")}
            </Button>
            <Button variant="outline" className="gap-3 h-11 bg-card text-card-foreground border-border hover:bg-secondary" onClick={handleAuth}>
              <MicrosoftIcon />
              {t("auth.microsoft")}
            </Button>
            <Button variant="outline" className="gap-3 h-11 bg-card text-card-foreground border-border hover:bg-secondary" onClick={handleAuth}>
              <Github className="h-4 w-4" />
              {t("auth.github")}
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
