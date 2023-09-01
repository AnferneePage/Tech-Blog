document.addEventListener("DOMContentLoaded", () => {
	const loginForm = document.querySelector("#login-form");

	if (loginForm) {
		// Define a function to handle form submission
		const handleFormSubmit = async (event) => {
			event.preventDefault(); // Prevent the default form submission behavior

			const formData = new FormData(loginForm);

			try {
				const response = await fetch("/login", {
					method: "POST",
					body: formData,
				});

				if (response.ok) {
					window.location.href = "/blog-feed"; // Redirect after successful login
				} else {
					// Handle errors if needed
					console.log("Login request failed:", response.statusText);
				}
			} catch (error) {
				console.error("An error occurred:", error);
			}
		};

		// Add an event listener to the form for form submission
		loginForm.addEventListener("submit", handleFormSubmit);
	}
});
