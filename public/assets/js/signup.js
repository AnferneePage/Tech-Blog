document.addEventListener('DOMContentLoaded', () => {
    
    const signupForm = document.querySelector('#signup-form');
  
    if (signupForm) {
      signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(signupForm);
        console.log(formData)
  
        // Send a POST request to the server
        try {
          const response = await fetch('/signup', {
            method: 'POST',
            body: formData,
          });
  
          if (response.ok) {
            // Redirect to the login page after successful signup
            window.location.href = '/dashboard';
          } else {
            // Handle errors if needed
            console.error('Signup request failed:', response.statusText);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      });
    }
  });
  