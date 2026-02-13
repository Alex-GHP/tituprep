export interface Database {
	public: {
		Tables: {
			subjects: {
				Row: {
					id: string;
					name_en: string;
					name_ro: string;
					module: string | null;
				};
				Insert: {
					id: string;
					name_en: string;
					name_ro: string;
					module?: string | null;
				};
				Update: {
					id?: string;
					name_en?: string;
					name_ro?: string;
					module?: string | null;
				};
			};
			questions: {
				Row: {
					id: string;
					question_en: string;
					question_ro: string;
					correct_answer_en: string;
					correct_answer_ro: string;
					wrong_answers_en: string[];
					wrong_answers_ro: string[];
					explanation_en: string | null;
					explanation_ro: string | null;
					subject_id: string;
				};
				Insert: {
					id?: string;
					question_en: string;
					question_ro: string;
					correct_answer_en: string;
					correct_answer_ro: string;
					wrong_answers_en: string[];
					wrong_answers_ro: string[];
					explanation_en?: string | null;
					explanation_ro?: string | null;
					subject_id: string;
				};
				Update: {
					id?: string;
					question_en?: string;
					question_ro?: string;
					correct_answer_en?: string;
					correct_answer_ro?: string;
					wrong_answers_en?: string[];
					wrong_answers_ro?: string[];
					explanation_en?: string | null;
					explanation_ro?: string | null;
					subject_id?: string;
				};
			};
			exams: {
				Row: {
					id: string;
					exam_number: number | null;
					type: "standard" | "subject" | "random";
					subject_id: string | null;
					title_en: string | null;
					title_ro: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					exam_number?: number | null;
					type: "standard" | "subject" | "random";
					subject_id?: string | null;
					title_en?: string | null;
					title_ro?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					exam_number?: number | null;
					type?: "standard" | "subject" | "random";
					subject_id?: string | null;
					title_en?: string | null;
					title_ro?: string | null;
					created_at?: string;
				};
			};
			exam_questions: {
				Row: {
					exam_id: string;
					question_id: string;
					position: number;
				};
				Insert: {
					exam_id: string;
					question_id: string;
					position: number;
				};
				Update: {
					exam_id?: string;
					question_id?: string;
					position?: number;
				};
			};
		profiles: {
			Row: {
				id: string;
				display_name: string | null;
				avatar_url: string | null;
				preferred_language: "en" | "ro";
				streak_count: number;
				last_active_date: string | null;
				created_at: string;
			};
			Insert: {
				id: string;
				display_name?: string | null;
				avatar_url?: string | null;
				preferred_language?: "en" | "ro";
				streak_count?: number;
				last_active_date?: string | null;
				created_at?: string;
			};
			Update: {
				id?: string;
				display_name?: string | null;
				avatar_url?: string | null;
				preferred_language?: "en" | "ro";
				streak_count?: number;
				last_active_date?: string | null;
				created_at?: string;
			};
		};
			user_attempts: {
				Row: {
					id: string;
					user_id: string;
					exam_id: string;
					score: number;
					total_questions: number;
					correct_count: number;
					answers: AnswerRecord[];
					time_taken_seconds: number | null;
					completed_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					exam_id: string;
					score: number;
					total_questions: number;
					correct_count: number;
					answers: AnswerRecord[];
					time_taken_seconds?: number | null;
					completed_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					exam_id?: string;
					score?: number;
					total_questions?: number;
					correct_count?: number;
					answers?: AnswerRecord[];
					time_taken_seconds?: number | null;
					completed_at?: string;
				};
			};
		};
	};
}

export interface AnswerRecord {
	question_id: string;
	selected_index: number | null;
	correct: boolean;
}

// Convenience type aliases
export type Subject = Database["public"]["Tables"]["subjects"]["Row"];
export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type Exam = Database["public"]["Tables"]["exams"]["Row"];
export type ExamQuestion = Database["public"]["Tables"]["exam_questions"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserAttempt = Database["public"]["Tables"]["user_attempts"]["Row"];
