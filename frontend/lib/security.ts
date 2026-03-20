export const getCookieValue = (name: string): string | null => {
	if (typeof document === "undefined") {
		return null;
	}

	const encodedName = `${encodeURIComponent(name)}=`;
	const cookies = document.cookie.split(";");

	for (const cookie of cookies) {
		const trimmed = cookie.trim();
		if (trimmed.startsWith(encodedName)) {
			return decodeURIComponent(trimmed.slice(encodedName.length));
		}
	}

	return null;
};

export const getCsrfToken = (): string | null => {
	return getCookieValue("csrf_token");
};
