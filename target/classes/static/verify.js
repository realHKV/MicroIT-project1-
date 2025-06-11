document.addEventListener('DOMContentLoaded', () => {
    const verificationForm = document.getElementById('verificationForm');
    const certificateIdInput = document.getElementById('certificateId');
    const verificationResultDiv = document.getElementById('verificationResult');
    const idsListElement = document.getElementById('idsList');

    // Function to display verification result
    function displayVerificationResult(data) {
        verificationResultDiv.innerHTML = `
            <h3>Application Details:</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Certificate ID:</strong> ${data.uniqueId}</p>
            <p><strong>College Name:</strong> ${data.collegeName}</p>
            <p><strong>Enrollment Number:</strong> ${data.collegeEnrollmentNumber}</p>
            <p><strong>Phone Number:</strong> ${data.phoneNumber}</p>
        `;
        verificationResultDiv.className = 'details-display success'; // Apply success style
        verificationResultDiv.style.display = 'block';
    }

    // Function to display an error message
    function displayErrorMessage(message) {
        verificationResultDiv.innerHTML = `<p class="message error">${message}</p>`;
        verificationResultDiv.className = 'details-display error'; // Apply error style
        verificationResultDiv.style.display = 'block';
    }

    // Function to fetch and display all certificate IDs
    async function fetchAndDisplayAllCertificateIds() {
        try {
            const response = await fetch('http://localhost:8080/api/applications');
            const ids = await response.json();

            idsListElement.innerHTML = ''; // Clear existing list
            if (ids && ids.length > 0) {
                ids.forEach(id => {
                    const li = document.createElement('li');
                    li.textContent = id;
                    idsListElement.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'No certificate IDs found yet.';
                idsListElement.appendChild(li);
            }
        } catch (error) {
            console.error('Error fetching all certificate IDs:', error);
            const li = document.createElement('li');
            li.textContent = 'Failed to load certificate IDs. Server might be down.';
            idsListElement.appendChild(li);
        }
    }

    // Event listener for verification form submission
    verificationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const certificateId = certificateIdInput.value.trim();
        if (!certificateId) {
            displayErrorMessage('Please enter a Certificate ID.');
            return;
        }

        try {
            // Send GET request to the backend API
            const response = await fetch(`http://localhost:8080/api/applications/${certificateId}`);
            const result = await response.json();

            if (response.ok) { // Check if the HTTP status code is in the 200-299 range
                displayVerificationResult(result);
            } else {
                // Handle errors (e.g., 404 Not Found)
                let errorMessage = 'Verification failed.';
                if (result && typeof result === 'string') {
                    errorMessage = result; // Use the direct error message from the backend
                } else if (result && result.message) {
                    errorMessage = result.message; // Use message from a structured error object
                }
                displayErrorMessage(errorMessage);
            }
        } catch (error) {
            // Handle network errors
            console.error('Error verifying certificate:', error);
            displayErrorMessage('Network error or server is unreachable. Please try again later.');
        }
    });

    // Fetch and display all IDs when the page loads
    fetchAndDisplayAllCertificateIds();
});