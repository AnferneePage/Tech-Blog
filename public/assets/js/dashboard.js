document.addEventListener("DOMContentLoaded", () => {
	const postForm = document.querySelector("#new-post-form");

	if (postForm) {
		postForm.addEventListener("submit", async (event) => {
			event.preventDefault();

			const formData = new FormData(postForm);

			try {
				const response = await fetch("/dashboard", {
					method: "POST",
					body: formData,
				});

				if (response.ok) {
					// If post creation is successful, you can redirect or update the UI as needed
					console.log("Post created successfully");
					window.location.reload(); // For example, refresh the page to show the new post
				} else {
					console.error("Post creation failed:", response.statusText);
				}
			} catch (error) {
				console.error("An error occurred:", error);
			}
		});
	}

	async function deletePost(postId) {
		try {
			// Send a DELETE request to your server to delete the post
			const response = await fetch(`/dashboard/${postId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				// Remove the deleted post from the UI
				const postElement = document.querySelector(`#post-${postId}`);
				if (postElement) {
					postElement.remove();
				}
			} else {
				console.log("Failed to delete post:", response.statusText);
			}
		} catch (error) {
			console.error("An error occurred:", error);
		}
	}

	const deleteBTN = document.querySelector("#delete");

	if (deleteBTN) {
		deleteBTN.addEventListener("click", async (event) => {
			if (event.target.classList.contains("delete-post")) {
				const postId = event.target.getAttribute("data-post-id");
				await deletePost(postId);
			}
		});
	}
});
