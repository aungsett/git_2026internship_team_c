import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CVUploadSection } from "../components/cv-upload-section";

describe("CVUploadSection", () => {
	it("renders upload section correctly", () => {
		render(<CVUploadSection onFileSelect={vi.fn()} />);

		expect(screen.getByText("Upload Your CV")).toBeInTheDocument();
		expect(
			screen.getByText(/Please upload your CV in PDF or Word format/i),
		).toBeInTheDocument();

		expect(
			screen.getByText(/Drag and drop your CV here/i),
		).toBeInTheDocument();

		expect(screen.getByText("Choose File")).toBeInTheDocument();
	});

	it("accepts valid PDF file and displays file info", async () => {
		const mockOnFileSelect = vi.fn();

		render(<CVUploadSection onFileSelect={mockOnFileSelect} />);

		const file = new File(["dummy content"], "resume.pdf", {
			type: "application/pdf",
		});

		const input = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;

		await userEvent.upload(input, file);

		expect(screen.getByText("resume.pdf")).toBeInTheDocument();

		expect(mockOnFileSelect).toHaveBeenCalledWith(file);
	});

	it("shows error for invalid file type", async () => {
		render(<CVUploadSection onFileSelect={vi.fn()} />);

		const file = new File(["dummy"], "image.png", {
			type: "image/png",
		});

		const input = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;

		await userEvent.upload(input, file);

		expect(
			screen.getByText("Accepted formats: PDF, DOC, DOCX (Max 5MB)"),
		).toBeInTheDocument();
	});

	it("shows error when file size exceeds 5MB limit", async () => {
		render(<CVUploadSection onFileSelect={vi.fn()} />);
		const largeFile = new File(
			[new ArrayBuffer(5 * 1024 * 1024 + 1)], // 5MB + 1 byte
			"large.pdf",
			{ type: "application/pdf" },
		);

		const input = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;

		await userEvent.upload(input, largeFile);

		expect(
			screen.getByText(/file size must be less than 5mb/i),
		).toBeInTheDocument();
	});

	it("removes file when remove button clicked", async () => {
		const mockOnFileSelect = vi.fn();

		render(<CVUploadSection onFileSelect={mockOnFileSelect} />);

		const file = new File(["dummy"], "resume.pdf", {
			type: "application/pdf",
		});

		const input = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;

		await userEvent.upload(input, file);

		const removeButton = screen.getByLabelText("Remove file");

		await userEvent.click(removeButton);

		expect(mockOnFileSelect).toHaveBeenCalledWith(null);

		expect(
			screen.getByText(/Drag and drop your CV here/i),
		).toBeInTheDocument();
	});

	it("handles drag and drop upload", () => {
		const mockOnFileSelect = vi.fn();

		render(<CVUploadSection onFileSelect={mockOnFileSelect} />);

		const file = new File(["dummy"], "resume.pdf", {
			type: "application/pdf",
		});

		const dropZone = screen
			.getByText(/Drag and drop your CV here/i)
			.closest("div")!;

		fireEvent.drop(dropZone, {
			dataTransfer: {
				files: [file],
			},
		});

		expect(mockOnFileSelect).toHaveBeenCalledWith(file);
	});

	// ===============================
	// 7. Shows file size correctly
	// ===============================

	it("displays formatted file size", async () => {
		render(<CVUploadSection onFileSelect={vi.fn()} />);

		const file = new File([new ArrayBuffer(1024 * 1024)], "resume.pdf", {
			type: "application/pdf",
		});

		const input = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;

		await userEvent.upload(input, file);

		expect(screen.getByText("1 MB")).toBeInTheDocument();
	});
});
