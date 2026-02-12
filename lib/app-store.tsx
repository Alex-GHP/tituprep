"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import type { ExamResult, Question } from "./exam-data"

interface AppState {
  isAuthenticated: boolean
  setAuthenticated: (v: boolean) => void
  currentPage: "landing" | "dashboard" | "exam" | "results" | "about"
  setCurrentPage: (p: "landing" | "dashboard" | "exam" | "results" | "about") => void
  examMode: "exam" | "training"
  setExamMode: (m: "exam" | "training") => void
  currentExamId: number | null
  setCurrentExamId: (id: number | null) => void
  currentSubjectId: string | null
  setCurrentSubjectId: (id: string | null) => void
  examQuestions: Question[]
  setExamQuestions: (q: Question[]) => void
  examResult: ExamResult | null
  setExamResult: (r: ExamResult | null) => void
  studyMode: boolean
  setStudyMode: (v: boolean) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState<AppState["currentPage"]>("landing")
  const [examMode, setExamMode] = useState<"exam" | "training">("exam")
  const [currentExamId, setCurrentExamId] = useState<number | null>(null)
  const [currentSubjectId, setCurrentSubjectId] = useState<string | null>(null)
  const [examQuestions, setExamQuestions] = useState<Question[]>([])
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [studyMode, setStudyMode] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        currentPage,
        setCurrentPage,
        examMode,
        setExamMode,
        currentExamId,
        setCurrentExamId,
        currentSubjectId,
        setCurrentSubjectId,
        examQuestions,
        setExamQuestions,
        examResult,
        setExamResult,
        studyMode,
        setStudyMode,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
