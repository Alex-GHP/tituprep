"use client"

import { LanguageProvider } from "@/lib/language-context"
import { AppProvider, useApp } from "@/lib/app-store"
import { Navbar } from "@/components/navbar"
import { LandingPage } from "@/components/landing-page"
import { DashboardPage } from "@/components/dashboard-page"
import { ExamPage } from "@/components/exam-page"
import { ResultsPage } from "@/components/results-page"
import { AboutPage } from "@/components/about-page"

function PageRouter() {
  const { currentPage } = useApp()

  return (
    <>
      {currentPage === "landing" && <LandingPage />}
      {currentPage === "dashboard" && <DashboardPage />}
      {currentPage === "exam" && <ExamPage />}
      {currentPage === "results" && <ResultsPage />}
      {currentPage === "about" && <AboutPage />}
    </>
  )
}

export default function Page() {
  return (
    <LanguageProvider>
      <AppProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">
            <PageRouter />
          </div>
          <footer className="border-t border-border bg-background py-4 text-center text-xs text-muted-foreground">
            ExamPrep &copy; {new Date().getFullYear()}
          </footer>
        </div>
      </AppProvider>
    </LanguageProvider>
  )
}
