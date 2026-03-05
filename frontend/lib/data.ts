import { Application } from "./types";

// Mock data
const generateMockApplications = (): Application[] => {
	const qualifications = [
		"Master's in Comp Science",
		"Bachelor of Arts",
		"Self-taught Developer",
		"B.Sc Marketing",
		"MBA",
		"B.Tech Information Technology",
		"Bachelor of Commerce",
		"Diploma in Engineering",
	];

	const courses = [
		"Web Development",
		"Mobile Development",
		"Data Science",
		"Machine Learning",
		"Cloud Computing",
		"DevOps",
		"Full Stack",
		"Frontend Development",
		"Backend Development",
	];

	const statuses: Array<
		"Shortlisted" | "Pending Review" | "Interviewed" | "Rejected"
	> = ["Shortlisted", "Pending Review", "Interviewed", "Rejected"];

	const firstNames = [
		"John",
		"Sarah",
		"Michael",
		"Emily",
		"David",
		"Jessica",
		"James",
		"Amanda",
		"Robert",
		"Linda",
		"William",
		"Barbara",
		"Richard",
		"Susan",
		"Joseph",
		"Jennifer",
		"Thomas",
		"Maria",
		"Christopher",
		"Patricia",
		"Daniel",
		"Karen",
		"Matthew",
		"Nancy",
		"Mark",
		"Lisa",
		"Donald",
		"Betty",
		"Steven",
		"Margaret",
		"Paul",
		"Sandra",
	];

	const lastNames = [
		"Doe",
		"Smith",
		"Johnson",
		"Williams",
		"Brown",
		"Jones",
		"Garcia",
		"Miller",
		"Davis",
		"Rodriguez",
		"Martinez",
		"Hernandez",
		"Lopez",
		"Gonzalez",
		"Wilson",
		"Anderson",
		"Thomas",
		"Taylor",
		"Moore",
		"Jackson",
		"Martin",
		"Lee",
		"Allen",
		"Young",
		"King",
		"Wright",
		"Abrams",
		"Klein",
		"White",
		"Harris",
		"Clark",
		"Lewis",
	];

	const domains = [
		"gmail.com",
		"yahoo.com",
		"company.co",
		"example.com",
		"cloud.io",
		"webmail.com",
	];

	const apps: Application[] = [];
	const baseDate = new Date("2023-10-24");

	for (let i = 0; i < 124; i++) {
		const firstName =
			firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName =
			lastNames[Math.floor(Math.random() * lastNames.length)];
		const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
		const phone = `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;

		const appliedDate = new Date(baseDate);
		appliedDate.setDate(appliedDate.getDate() + i);

		apps.push({
			id: `app-${i + 1}`,
			name: `${firstName} ${lastName}`,
			email,
			phone,
			qualification:
				qualifications[
					Math.floor(Math.random() * qualifications.length)
				],
			experience: `${Math.floor(Math.random() * 15) + 1} Year${Math.floor(Math.random() * 15) + 1 !== 1 ? "s" : ""}`,
			course: courses[Math.floor(Math.random() * courses.length)],
			status: statuses[Math.floor(Math.random() * statuses.length)],
			appliedDate,
		});
	}

	return apps;
};

export const mockApplications = generateMockApplications();
