"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

type Language = "en" | "ro"

interface Translations {
  [key: string]: { en: string; ro: string }
}

const translations: Translations = {
  // Landing
  "hero.title": { en: "Master Your Exams", ro: "Stapaneste Examenele" },
  "hero.subtitle": { en: "Practice smarter with timed exams and subject-based training for programming fundamentals.", ro: "Exerseaza mai inteligent cu examene cronometrate si antrenament pe materii." },
  "hero.cta": { en: "Get Started", ro: "Incepe Acum" },
  "hero.spotlight": { en: "Developer Spotlight", ro: "Proiectul Dezvoltatorului" },
  "hero.spotlightDesc": { en: "Built with passion for CS students preparing for their exams.", ro: "Creat cu pasiune pentru studentii de informatica." },
  "auth.google": { en: "Continue with Google", ro: "Continua cu Google" },
  "auth.microsoft": { en: "Continue with Microsoft", ro: "Continua cu Microsoft" },
  "auth.github": { en: "Continue with GitHub", ro: "Continua cu GitHub" },
  "auth.or": { en: "or sign in with", ro: "sau conecteaza-te cu" },

  // Dashboard
  "dash.title": { en: "Dashboard", ro: "Panou de Control" },
  "dash.fullExams": { en: "Full Exams", ro: "Examene Complete" },
  "dash.subjectTraining": { en: "Subject Training", ro: "Antrenament pe Materii" },
  "dash.exam": { en: "Exam", ro: "Examen" },
  "dash.bestScore": { en: "Best Score", ro: "Cel Mai Bun Scor" },
  "dash.notAttempted": { en: "Not attempted", ro: "Neinceput" },
  "dash.questions": { en: "questions", ro: "intrebari" },
  "dash.progress": { en: "Progress", ro: "Progres" },
  "dash.generateRandom": { en: "Generate Random Exam", ro: "Genereaza Examen Aleator" },
  "dash.startExam": { en: "Start Exam", ro: "Incepe Examenul" },
  "dash.startTraining": { en: "Start Training", ro: "Incepe Antrenamentul" },

  // Exam
  "exam.question": { en: "Question", ro: "Intrebarea" },
  "exam.of": { en: "of", ro: "din" },
  "exam.previous": { en: "Previous", ro: "Inapoi" },
  "exam.next": { en: "Next", ro: "Urmatoarea" },
  "exam.submit": { en: "Submit Exam", ro: "Trimite Examenul" },
  "exam.timeRemaining": { en: "Time Remaining", ro: "Timp Ramas" },
  "exam.studyMode": { en: "Study Mode", ro: "Mod Studiu" },
  "exam.studyModeDesc": { en: "No timer, learn at your own pace", ro: "Fara cronometru, invata in ritmul tau" },
  "exam.confirmSubmit": { en: "Are you sure you want to submit?", ro: "Esti sigur ca vrei sa trimiti?" },
  "exam.unanswered": { en: "unanswered questions", ro: "intrebari fara raspuns" },

  // Results
  "results.title": { en: "Exam Results", ro: "Rezultatele Examenului" },
  "results.score": { en: "Your Score", ro: "Scorul Tau" },
  "results.correct": { en: "Correct", ro: "Corecte" },
  "results.incorrect": { en: "Incorrect", ro: "Incorecte" },
  "results.review": { en: "Review Answers", ro: "Revizuieste Raspunsurile" },
  "results.explanation": { en: "Explanation", ro: "Explicatie" },
  "results.yourAnswer": { en: "Your answer", ro: "Raspunsul tau" },
  "results.correctAnswer": { en: "Correct answer", ro: "Raspunsul corect" },
  "results.backToDashboard": { en: "Back to Dashboard", ro: "Inapoi la Panou" },
  "results.retake": { en: "Retake Exam", ro: "Reincepe Examenul" },

  // About
  "about.title": { en: "About", ro: "Despre" },
  "about.bio": { en: "A passionate developer building tools for CS students.", ro: "Un dezvoltator pasionat care creaza unelte pentru studentii de informatica." },

  // Nav
  "nav.home": { en: "Home", ro: "Acasa" },
  "nav.dashboard": { en: "Dashboard", ro: "Panou" },
  "nav.about": { en: "About", ro: "Despre" },
  "nav.signOut": { en: "Sign Out", ro: "Deconecteaza-te" },

  // Common
  "common.darkMode": { en: "Dark Mode", ro: "Mod Inchis" },
  "common.lightMode": { en: "Light Mode", ro: "Mod Deschis" },
  "common.language": { en: "Language", ro: "Limba" },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = useCallback(
    (key: string) => {
      const entry = translations[key]
      if (!entry) return key
      return entry[language]
    },
    [language]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider")
  return context
}
