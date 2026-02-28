import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { ApplicantForm } from "../components/applicant-form";
import { useState } from "react";

const initialFormData = {
	firstName: "",
	lastName: "",
	dateOfBirth: "",
	phone: "",
	email: "",
	currentAddress: "",
	highestQualification: "",
	college: "",
	yearsOfExperience: "",
	preferredJapaneseCourse: "",
	coreSkills: "",
	languagesKnown: "",
	linkedIn: "",
	portfolioGithub: "",
	additionalNotes: "",
};

function TestWrapper() {
	const [formData, setFormData] = useState(initialFormData);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<ApplicantForm
			formData={formData}
			handleInputChange={handleInputChange}
		/>
	);
}

describe("ApplicantForm - Full Behaviour Testing", () => {
	it("renders all major sections", () => {
		render(<TestWrapper />);

		expect(screen.getByText("Personal Information")).toBeInTheDocument();
		expect(screen.getByText("Professional Details")).toBeInTheDocument();
		expect(screen.getByText("Links & Social")).toBeInTheDocument();
		expect(screen.getByText("Additional Information")).toBeInTheDocument();
	});

	it("renders all input fields", () => {
		render(<TestWrapper />);

		expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText("john@example.com"),
		).toBeInTheDocument();
	});

	it("updates firstName when user types", async () => {
		render(<TestWrapper />);

		const input = screen.getByPlaceholderText("John");

		await userEvent.type(input, "Anushree");

		expect(input).toHaveValue("Anushree");
	});
	it("updates lastName when user types", async () => {
		render(<TestWrapper />);

		const input = screen.getByPlaceholderText("Doe");

		await userEvent.type(input, "Smith");

		expect(input).toHaveValue("Smith");
	});
	it("updates dateOfBirth", async () => {
		render(<TestWrapper />);

		const input = screen.getByPlaceholderText("mm/dd/yyyy");

		await userEvent.type(input, "2000-01-01");

		expect(input).toHaveValue("2000-01-01");
	});
	it("updates phone when user types", async () => {
		render(<TestWrapper />);

		const phoneInput = screen.getByPlaceholderText("+1 (555) 000-0000");

		await userEvent.type(phoneInput, "9999999999");

		expect(phoneInput).toHaveValue("9999999999");
	});
	it("updates email when user types", async () => {
		render(<TestWrapper />);

		const emailInput = screen.getByPlaceholderText("john@example.com");

		await userEvent.type(emailInput, "test@mail.com");

		expect(emailInput).toHaveValue("test@mail.com");
	});
	it("updates currentAddress", async () => {
		render(<TestWrapper />);

		const textarea = screen.getByPlaceholderText("Street, City, Country");

		await userEvent.type(textarea, "New Delhi");

		expect(textarea).toHaveValue("New Delhi");
	});
	it("updates highestQualification when selecting option", async () => {
		render(<TestWrapper />);

		const select = screen.getAllByRole("combobox")[0];

		await userEvent.selectOptions(select, "bachelors");

		expect(select).toHaveValue("bachelors");
	});
	it("updates college", async () => {
		render(<TestWrapper />);

		const input = screen.getByPlaceholderText("University Name");

		await userEvent.type(input, "VIT Bhopal");

		expect(input).toHaveValue("VIT Bhopal");
	});
	it("updates yearsOfExperience", async () => {
		render(<TestWrapper />);

		const input = screen.getByPlaceholderText("e.g. 5");

		await userEvent.type(input, "5");

		expect(input).toHaveValue("5");
	});
	it("updates preferredJapaneseCourse when selecting option", async () => {
		render(<TestWrapper />);

		const selects = screen.getAllByRole("combobox");
		const preferredCourseSelect = selects[1];

		await userEvent.selectOptions(preferredCourseSelect, "weekdays");

		expect(preferredCourseSelect).toHaveValue("weekdays");
	});

	it("updates coreSkills textarea", async () => {
		render(<TestWrapper />);

		const textarea = screen.getByPlaceholderText(
			"e.g. React, Node.js, AWS, Python (comma separated)",
		);

		await userEvent.type(textarea, "React, Node");

		expect(textarea).toHaveValue("React, Node");
	});
	it("updates languagesKnown", async () => {
		render(<TestWrapper />);

		const textarea = screen.getByPlaceholderText(
			"e.g. English (Fluent), Japanese (Basic)",
		);

		await userEvent.type(textarea, "English");

		expect(textarea).toHaveValue("English");
	});
	it("updates linkedIn", async () => {
		render(<TestWrapper />);

		const input = screen.getByPlaceholderText(
			"https://linkedin.com/in/username",
		);

		await userEvent.type(input, "https://linkedin.com/in/test");

		expect(input).toHaveValue("https://linkedin.com/in/test");
	});
	it("updates portfolioGithub", async () => {
		render(<TestWrapper />);

		const input = screen.getByPlaceholderText("Portfolio/GitHub Link");

		await userEvent.type(input, "https://github.com/test");

		expect(input).toHaveValue("https://github.com/test");
	});
	it("updates additionalNotes textarea", async () => {
		render(<TestWrapper />);

		const textarea = screen.getByPlaceholderText(
			"Anything else you'd like us to know?",
		);

		await userEvent.type(textarea, "Looking forward to it!");

		expect(textarea).toHaveValue("Looking forward to it!");
	});

	it("renders pre-filled values correctly", () => {
		const preFilledData = {
			...initialFormData,
			firstName: "John",
			email: "john@mail.com",
		};

		function PreFilledWrapper() {
			const [formData] = useState(preFilledData);

			return (
				<ApplicantForm
					formData={formData}
					handleInputChange={() => {}}
				/>
			);
		}

		render(<PreFilledWrapper />);

		expect(screen.getByDisplayValue("John")).toBeInTheDocument();
		expect(screen.getByDisplayValue("john@mail.com")).toBeInTheDocument();
	});
});
