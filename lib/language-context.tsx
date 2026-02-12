"use client";

import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/auth-provider";

type Language = "en" | "ro";

interface Translations {
	[key: string]: { en: string; ro: string };
}

const translations: Translations = {
	// Landing / Hero
	"hero.title": { en: "Master Your Exams", ro: "Stapaneste Examenele" },
	"hero.subtitle": {
		en: "Practice smarter with timed exams and subject-based training for programming fundamentals.",
		ro: "Exerseaza mai inteligent cu examene cronometrate si antrenament pe materii.",
	},
	"hero.cta": { en: "Get Started", ro: "Incepe Acum" },
	"hero.spotlight": {
		en: "Developer Spotlight",
		ro: "Proiectul Dezvoltatorului",
	},
	"hero.spotlightDesc": {
		en: "Built with passion for CS students preparing for their exams.",
		ro: "Creat cu pasiune pentru studentii de informatica.",
	},

	// Features
	"features.timedExams": { en: "Timed Exams", ro: "Examene Cronometrate" },
	"features.timedExamsDesc": {
		en: "Simulate real exam conditions with countdown timers and 20 practice exams.",
		ro: "Simuleaza conditii reale de examen cu cronometru si 20 de examene de practica.",
	},
	"features.codeQuestions": { en: "Code Questions", ro: "Intrebari cu Cod" },
	"features.codeQuestionsDesc": {
		en: "Practice with real code snippets and syntax-highlighted questions.",
		ro: "Exerseaza cu fragmente de cod reale si intrebari cu evidentierea sintaxei.",
	},
	"features.trackProgress": {
		en: "Track Progress",
		ro: "Urmareste Progresul",
	},
	"features.trackProgressDesc": {
		en: "Monitor your scores and progress across subjects and exams.",
		ro: "Monitorizeaza scorurile si progresul pe materii si examene.",
	},

	// Auth
	"auth.google": { en: "Continue with Google", ro: "Continua cu Google" },
	"auth.microsoft": {
		en: "Continue with Microsoft",
		ro: "Continua cu Microsoft",
	},
	"auth.github": { en: "Continue with GitHub", ro: "Continua cu GitHub" },
	"auth.or": { en: "or sign in with", ro: "sau conecteaza-te cu" },

	// Dashboard
	"dash.title": { en: "Dashboard", ro: "Panou de Control" },
	"dash.subtitle": {
		en: "Select an exam or subject to begin practicing.",
		ro: "Selecteaza un examen sau o materie pentru a incepe.",
	},
	"dash.fullExams": { en: "Full Exams", ro: "Examene Complete" },
	"dash.subjectTraining": {
		en: "Subject Training",
		ro: "Antrenament pe Materii",
	},
	"dash.exam": { en: "Exam", ro: "Examen" },
	"dash.bestScore": { en: "Best Score", ro: "Cel Mai Bun Scor" },
	"dash.notAttempted": { en: "Not attempted", ro: "Neinceput" },
	"dash.questions": { en: "questions", ro: "intrebari" },
	"dash.progress": { en: "Progress", ro: "Progres" },
	"dash.generateRandom": {
		en: "Generate Random Exam",
		ro: "Genereaza Examen Aleator",
	},
	"dash.startExam": { en: "Start Exam", ro: "Incepe Examenul" },
	"dash.startTraining": {
		en: "Start Training",
		ro: "Incepe Antrenamentul",
	},

	// Exam
	"exam.question": { en: "Question", ro: "Intrebarea" },
	"exam.of": { en: "of", ro: "din" },
	"exam.previous": { en: "Previous", ro: "Inapoi" },
	"exam.next": { en: "Next", ro: "Urmatoarea" },
	"exam.submit": { en: "Submit Exam", ro: "Trimite Examenul" },
	"exam.cancel": { en: "Cancel", ro: "Anuleaza" },
	"exam.timeRemaining": { en: "Time Remaining", ro: "Timp Ramas" },
	"exam.studyMode": { en: "Study Mode", ro: "Mod Studiu" },
	"exam.studyModeDesc": {
		en: "No timer, learn at your own pace",
		ro: "Fara cronometru, invata in ritmul tau",
	},
	"exam.confirmSubmit": {
		en: "Are you sure you want to submit?",
		ro: "Esti sigur ca vrei sa trimiti?",
	},
	"exam.unanswered": {
		en: "unanswered questions",
		ro: "intrebari fara raspuns",
	},

	// Results
	"results.title": { en: "Exam Results", ro: "Rezultatele Examenului" },
	"results.score": { en: "Your Score", ro: "Scorul Tau" },
	"results.correct": { en: "Correct", ro: "Corecte" },
	"results.incorrect": { en: "Incorrect", ro: "Incorecte" },
	"results.review": {
		en: "Review Answers",
		ro: "Revizuieste Raspunsurile",
	},
	"results.explanation": { en: "Explanation", ro: "Explicatie" },
	"results.yourAnswer": { en: "Your answer", ro: "Raspunsul tau" },
	"results.correctAnswer": { en: "Correct answer", ro: "Raspunsul corect" },
	"results.backToDashboard": {
		en: "Back to Dashboard",
		ro: "Inapoi la Panou",
	},
	"results.retake": { en: "Retake Exam", ro: "Reincepe Examenul" },

	// About
	"about.title": { en: "About", ro: "Despre" },
	"about.bio": {
		en: "A passionate developer building tools for CS students.",
		ro: "Un dezvoltator pasionat care creaza unelte pentru studentii de informatica.",
	},
	"about.student": {
		en: "Computer Science Student",
		ro: "Student in Informatica",
	},
	"about.university": {
		en: "Babes-Bolyai University, Cluj-Napoca",
		ro: "Universitatea Babes-Bolyai, Cluj-Napoca",
	},
	"about.connect": { en: "Connect", ro: "Contact" },
	"about.technologies": { en: "Technologies", ro: "Tehnologii" },
	"about.portfolio": { en: "Portfolio", ro: "Portofoliu" },

	// Nav
	"nav.home": { en: "Home", ro: "Acasa" },
	"nav.dashboard": { en: "Dashboard", ro: "Panou" },
	"nav.about": { en: "About", ro: "Despre" },
	"nav.signOut": { en: "Sign Out", ro: "Deconecteaza-te" },

	// Common
	"common.darkMode": { en: "Dark Mode", ro: "Mod Inchis" },
	"common.lightMode": { en: "Light Mode", ro: "Mod Deschis" },
	"common.language": { en: "Language", ro: "Limba" },
	"common.loading": { en: "Loading...", ro: "Se incarca..." },
};

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [language, setLanguageState] = useState<Language>("en");
	const { user } = useAuth();
	const supabase = createClient();

	// Load preferred language from profile on mount
	useEffect(() => {
		if (!user) return;
		supabase
			.from("profiles")
			.select("preferred_language")
			.eq("id", user.id)
			.single()
			.then(({ data }) => {
				if (data?.preferred_language) {
					setLanguageState(data.preferred_language as Language);
				}
			});
	}, [user, supabase]);

	// Update <html lang> attribute when language changes
	useEffect(() => {
		document.documentElement.lang = language;
	}, [language]);

	const setLanguage = useCallback(
		(lang: Language) => {
			setLanguageState(lang);
			// Persist to profile if logged in
			if (user) {
				supabase
					.from("profiles")
					.update({ preferred_language: lang })
					.eq("id", user.id)
					.then(() => {});
			}
		},
		[user, supabase],
	);

	const t = useCallback(
		(key: string) => {
			const entry = translations[key];
			if (!entry) return key;
			return entry[language];
		},
		[language],
	);

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context)
		throw new Error("useLanguage must be used within a LanguageProvider");
	return context;
}
