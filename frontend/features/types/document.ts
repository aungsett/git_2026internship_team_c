export interface Document {
	document_id: number;

	applicant_id: number;

	file_name?: string | null;
	file_type?: string | null;

	document_url: string; // Cloudinary URL

	uploaded_at?: string | null; // ISO string
}
