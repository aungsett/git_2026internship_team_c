export type AdminRole = "recruiter" | "superadmin";

export interface Admin {
	admin_id: number;
	firebase_uid: string;
	username: string;
	email: string;
	role: AdminRole;
	created_at?: string | null;
}
