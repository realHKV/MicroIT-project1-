document.addEventListener('DOMContentLoaded', () => {
    const applicationForm = document.getElementById('applicationForm');
    const responseMessageDiv = document.getElementById('responseMessage');

    // Function to display messages
    function displayMessage(message, type) {
        responseMessageDiv.textContent = message;
        responseMessageDiv.className = `message ${type}`; // Add success or error class
        responseMessageDiv.style.display = 'block'; // Ensure it's visible
    }

    // Event listener for form submission
    applicationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Gather form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            collegeName: document.getElementById('collegeName').value,
            collegeEnrollmentNumber: document.getElementById('collegeEnrollmentNumber').value,
            phoneNumber: document.getElementById('phoneNumber').value
        };

        try {
            // Send POST request to the backend API
            const response = await fetch('http://localhost:8080/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify content type as JSON
                },
                body: JSON.stringify(formData), // Convert form data to JSON string
            });

            // Parse the JSON response from the backend
            const result = await response.json();

            if (response.ok) { // Check if the HTTP status code is in the 200-299 range
                displayMessage(
                    `Application submitted successfully! Your Certificate ID is: ${result.uniqueId}`,
                    'success'
                );
                applicationForm.reset(); // Clear the form
            } else {
                // Handle API errors (e.g., validation errors from Spring Boot)
                let errorMessage = 'Failed to submit application.';
                if (result) {
                    if (typeof result === 'object' && result !== null) {
                        // If backend returns validation errors (Map<String, String>)
                        errorMessage += '\n' + Object.values(result).join('\n');
                    } else if (typeof result === 'string') {
                        // If backend returns a plain error message string
                        errorMessage = result;
                    }
                }
                displayMessage(errorMessage, 'error');
            }
        } catch (error) {
            // Handle network errors or issues with the fetch request
            console.error('Error submitting application:', error);
            displayMessage('Network error or server is unreachable. Please try again later.', 'error');
        }
    });
});