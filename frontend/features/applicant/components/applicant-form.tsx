export const ApplicantForm = ({
	formData,
	handleInputChange,
}: {
	formData: any;
	handleInputChange: any;
}) => {
	return (
		<>
			{/* Personal Information Section */}
			<div className="bg-white rounded-lg border border-slate-200">
				<div className="w-full px-6 py-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-slate-900">
						Personal Information
					</h2>
				</div>

				<div className="px-6 pb-6 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								First Name
							</label>
							<input
								type="text"
								name="firstName"
								value={formData.firstName}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="John"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Last Name
							</label>
							<input
								type="text"
								name="lastName"
								value={formData.lastName}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Doe"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Date of Birth
							</label>
							<input
								type="date"
								name="dateOfBirth"
								value={formData.dateOfBirth}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="mm/dd/yyyy"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Phone Number
							</label>
							<input
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="+1 (555) 000-0000"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">
							Email Address
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="john@example.com"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">
							Current Address
						</label>
						<input
							type="text"
							name="currentAddress"
							value={formData.currentAddress}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Street, City, Country"
						/>
					</div>
				</div>
			</div>

			{/* Professional Details Section */}
			<div className="bg-white rounded-lg border border-slate-200">
				<div className="w-full px-6 py-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-slate-900">
						Professional Details
					</h2>
				</div>

				<div className="px-6 pb-6 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Highest Qualification
							</label>
							<select
								name="highestQualification"
								value={formData.highestQualification}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Select qualification</option>
								<option value="high-school">High School</option>
								<option value="bachelors">
									Bachelors Degree
								</option>
								<option value="masters">Masters Degree</option>
								<option value="phd">PhD</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								College/University
							</label>
							<input
								type="text"
								name="college"
								value={formData.college}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="University Name"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Years of Experience
							</label>
							<input
								type="text"
								name="yearsOfExperience"
								value={formData.yearsOfExperience}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="e.g. 5"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Preferred Japanese Course
							</label>
							<select
								name="preferredJapaneseCourse"
								value={formData.preferredJapaneseCourse}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Select preference</option>
								<option value="weekdays">Weekdays</option>
								<option value="weekends">Weekends</option>
								<option value="evening">Evening</option>
							</select>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">
							Core Skills
						</label>
						<input
							type="text"
							name="coreSkills"
							value={formData.coreSkills}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="e.g. React, Node.js, AWS, Python (comma separated)"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">
							Languages Known
						</label>
						<input
							type="text"
							name="languagesKnown"
							value={formData.languagesKnown}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="e.g. English (Fluent), Japanese (Basic)"
						/>
					</div>
				</div>
			</div>

			{/* Links & Social Section */}
			<div className="bg-white rounded-lg border border-slate-200">
				<div className="w-full px-6 py-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-slate-900">
						Links & Social
					</h2>
				</div>

				<div className="px-6 pb-6 space-y-4">
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">
							LinkedIn Profile URL
						</label>
						<input
							type="url"
							name="linkedIn"
							value={formData.linkedIn}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="https://linkedin.com/in/username"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">
							Optional: Link to your professional profile
						</label>
						<input
							type="url"
							name="portfolioGithub"
							value={formData.portfolioGithub}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Portfolio/GitHub Link"
						/>
					</div>
				</div>
			</div>

			{/* Additional Information Section */}
			<div className="bg-white rounded-lg border border-slate-200">
				<div className="w-full px-6 py-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-slate-900">
						Additional Information
					</h2>
				</div>

				<div className="px-6 pb-6 space-y-6">
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">
							Comments or Additional Notes
						</label>
						<textarea
							name="additionalNotes"
							value={formData.additionalNotes}
							onChange={handleInputChange}
							rows={4}
							className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
							placeholder="Anything else you'd like us to know?"
						/>
					</div>
				</div>
			</div>
		</>
	);
};
