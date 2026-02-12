"use client"

import { useApp } from "@/lib/app-store"
import { useLanguage } from "@/lib/language-context"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { Button } from "@/components/ui/button"
import { BookOpen, LogOut, LayoutDashboard, Home, Info } from "lucide-react"

export function Navbar() {
  const { isAuthenticated, setAuthenticated, currentPage, setCurrentPage } = useApp()
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <button
          onClick={() => setCurrentPage(isAuthenticated ? "dashboard" : "landing")}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-semibold text-lg">ExamPrep</span>
        </button>

        <div className="flex items-center gap-1">
          {isAuthenticated && (
            <>
              <Button
                variant={currentPage === "dashboard" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage("dashboard")}
                className="gap-1.5 text-foreground"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.dashboard")}</span>
              </Button>
              <Button
                variant={currentPage === "about" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage("about")}
                className="gap-1.5 text-foreground"
              >
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.about")}</span>
              </Button>
            </>
          )}
          {!isAuthenticated && (
            <Button
              variant={currentPage === "landing" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentPage("landing")}
              className="gap-1.5 text-foreground"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.home")}</span>
            </Button>
          )}

          <LanguageToggle />
          <ThemeToggle />

          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setAuthenticated(false)
                setCurrentPage("landing")
              }}
              className="text-muted-foreground hover:text-destructive"
              aria-label={t("nav.signOut")}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}
