"use client";

import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useAuth } from "@/lib/supabase/auth-provider";
import { createClient } from "@/lib/supabase/client";

type Language = "en" | "ro";

interface Translations {
	[key: string]: { en: string; ro: string };
}

const translations: Translations = {
	// Landing / Hero
	"hero.title": {
		en: "Master the Bachelor Exam",
		ro: "Master the Bachelor Exam",
	},
	"hero.subtitle": {
		en: "Practice smarter with timed exams and subject-based training.",
		ro: "Practice smarter with timed exams and subject-based training.",
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
	"auth.github": { en: "Continue with GitHub", ro: "Continua cu GitHub" },
	"auth.signIn": {
		en: "Sign in to get started",
		ro: "Conecteaza-te pentru a incepe",
	},

	// Dashboard
	"dash.title": { en: "Dashboard", ro: "Dashboard" },
	"dash.subtitle": {
		en: "Select an exam or subject to begin practicing.",
		ro: "Selecteaza un examen sau o materie pentru a incepe.",
	},
	"dash.fullExams": { en: "Full Exams", ro: "Examene Complete" },
	"dash.subjectTraining": {
		en: "Subject Training",
		ro: "Antrenament pe Materii",
	},
	"dash.exam": { en: "Exam", ro: "Exam" },
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
	"exam.studyMode": { en: "Study Mode", ro: "Study Mode" },
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
		ro: "Inapoi la Dashboard",
	},
	"results.retake": { en: "Retake Exam", ro: "Reincepe Examenul" },

	// About
	"about.title": { en: "About", ro: "About" },
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
	"about.portfolio": { en: "Website", ro: "Website" },
	"about.support": { en: "Support", ro: "Sustinere" },
	"about.supportDesc": {
		en: "My own money were and are used to develop and maintain this project (domain, hosting, storage, etc.). Please do not feel obligated, but support is highly appreciated.",
		ro: "Banii mei proprii au fost si sunt folositi pentru a dezvolta si mentine acest proiect (domain, hosting, storage, etc.). Te rog nu te simti obligat, dar sustinerea este foarte apreciata.",
	},
	"about.contributions": { en: "Contribute", ro: "Contribuie" },
	"about.contributionsDesc": {
		en: "This project was developed by a Titu student for Titu students. Contributions are more than welcomed",
		ro: "Acest proiect a fost dezvoltat de un student Titu pentru studentii Titu. Contributiile sunt mai mult decât binevenite",
	},

	// Nav
	"nav.home": { en: "Home", ro: "Home" },
	"nav.dashboard": { en: "Dashboard", ro: "Dashboard" },
	"nav.leaderboard": { en: "Leaderboard", ro: "Leaderboard" },
	"nav.about": { en: "About", ro: "About" },
	"nav.signOut": { en: "Sign Out", ro: "Deconecteaza-te" },
	"nav.streak": { en: "day streak", ro: "zile consecutive" },

	// Leaderboard
	"leaderboard.title": { en: "Leaderboard", ro: "Leaderboard" },
	"leaderboard.subtitle": {
		en: "See how you rank against other students.",
		ro: "Vezi cum te clasezi fata de ceilalti studenti.",
	},
	"leaderboard.yourRank": { en: "Your Rank", ro: "Pozitia Ta" },
	"leaderboard.score": { en: "Score", ro: "Scor" },
	"leaderboard.streak": { en: "Streak", ro: "Serie" },
	"leaderboard.multiplier": { en: "Multiplier", ro: "Multiplicator" },
	"leaderboard.rankings": { en: "Rankings", ro: "Clasament" },
	"leaderboard.empty": {
		en: "No entries yet. Complete an exam to appear on the leaderboard!",
		ro: "Nicio intrare inca. Completeaza un examen pentru a aparea in clasament!",
	},
	"leaderboard.you": { en: "You", ro: "Tu" },
	"leaderboard.dayStreak": { en: "day streak", ro: "zile consecutive" },
	"leaderboard.base": { en: "base", ro: "baza" },
	"leaderboard.howItWorks": {
		en: "How scoring works:",
		ro: "Cum functioneaza scorul:",
	},
	"leaderboard.howItWorksDesc": {
		en: "Your leaderboard score is the sum of all your exam scores multiplied by your streak bonus. Each consecutive day you complete an exam adds ×0.1 to your multiplier.",
		ro: "Scorul tau in clasament este suma tuturor scorurilor tale la examene, inmultita cu bonusul de obitnut prin daily streak. Fiecare zi consecutiva in care completezi un examen adauga ×0.1 la multiplicator.",
	},

	// Common
	"common.darkMode": { en: "Dark Mode", ro: "Dark Mode" },
	"common.lightMode": { en: "Light Mode", ro: "Light Mode" },
	"common.language": { en: "Language", ro: "Language" },
	"common.loading": { en: "Loading...", ro: "Loading..." },
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
		(
			supabase
				.from("profiles")
				.select("preferred_language")
				.eq("id", user.id)
				.single() as unknown as Promise<{
				data: { preferred_language: Language } | null;
			}>
		).then(({ data }) => {
			if (data?.preferred_language) {
				setLanguageState(data.preferred_language);
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
				(supabase.from("profiles") as ReturnType<typeof supabase.from>)
					.update({ preferred_language: lang } as Record<string, unknown>)
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
