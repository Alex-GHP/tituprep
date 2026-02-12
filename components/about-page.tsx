"use client"

import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Github, Linkedin, Globe, Mail } from "lucide-react"

export function AboutPage() {
  const { t, language } = useLanguage()

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t("about.title")}</h1>

      <Card className="mt-6 bg-card border-border">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="text-2xl font-bold">CS</span>
            </div>
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">
                  {language === "en" ? "Computer Science Student" : "Student in Informatica"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {language === "en"
                    ? "Babes-Bolyai University, Cluj-Napoca"
                    : "Universitatea Babes-Bolyai, Cluj-Napoca"}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("about.bio")}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider">
              {language === "en" ? "Connect" : "Contact"}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-border text-foreground hover:bg-secondary" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-border text-foreground hover:bg-secondary" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-border text-foreground hover:bg-secondary" asChild>
                <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                  {language === "en" ? "Portfolio" : "Portofoliu"}
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-border text-foreground hover:bg-secondary" asChild>
                <a href="mailto:student@example.com">
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider">
              {language === "en" ? "Technologies" : "Tehnologii"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {["React", "Next.js", "TypeScript", "Tailwind CSS", "Python", "C++", "PostgreSQL"].map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
