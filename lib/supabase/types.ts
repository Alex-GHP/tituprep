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
				Relationships: [];
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
				Relationships: [
					{
						foreignKeyName: "questions_subject_id_fkey";
						columns: ["subject_id"];
						isOneToOne: false;
						referencedRelation: "subjects";
						referencedColumns: ["id"];
					},
				];
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
				Relationships: [
					{
						foreignKeyName: "exams_subject_id_fkey";
						columns: ["subject_id"];
						isOneToOne: false;
						referencedRelation: "subjects";
						referencedColumns: ["id"];
					},
				];
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
				Relationships: [
					{
						foreignKeyName: "exam_questions_exam_id_fkey";
						columns: ["exam_id"];
						isOneToOne: false;
						referencedRelation: "exams";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "exam_questions_question_id_fkey";
						columns: ["question_id"];
						isOneToOne: false;
						referencedRelation: "questions";
						referencedColumns: ["id"];
					},
				];
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
				Relationships: [];
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
				Relationships: [
					{
						foreignKeyName: "user_attempts_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_attempts_exam_id_fkey";
						columns: ["exam_id"];
						isOneToOne: false;
						referencedRelation: "exams";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: Record<string, never>;
		Functions: {
			get_leaderboard: {
				Args: Record<string, never>;
				Returns: {
					user_id: string;
					display_name: string | null;
					avatar_url: string | null;
					total_score: number;
					streak_count: number;
					leaderboard_score: number;
					created_at: string;
				}[];
			};
		};
	};
}

export interface AnswerRecord {
	question_id: string;
	selected_index: number | null;
	correct: boolean;
	selected_answer_en?: string | null;
	selected_answer_ro?: string | null;
}

// Convenience type aliases
export type Subject = Database["public"]["Tables"]["subjects"]["Row"];
export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type Exam = Database["public"]["Tables"]["exams"]["Row"];
export type ExamQuestion =
	Database["public"]["Tables"]["exam_questions"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserAttempt = Database["public"]["Tables"]["user_attempts"]["Row"];
