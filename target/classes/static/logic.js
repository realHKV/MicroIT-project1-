
        function showHomePage() {
            document.querySelector('.container').style.display = 'block';
            document.getElementById('applyPage').style.display = 'none';
            document.getElementById('verifyPage').style.display = 'none';
        }

        function showApplyPage() {
            document.querySelector('.container').style.display = 'none';
            document.getElementById('applyPage').style.display = 'block';
            document.getElementById('verifyPage').style.display = 'none';
        }

        function showVerifyPage() {
            document.querySelector('.container').style.display = 'none';
            document.getElementById('applyPage').style.display = 'none';
            document.getElementById('verifyPage').style.display = 'block';
            loadCertificateIds();
        }

        // Load certificate IDs for verification page
        function loadCertificateIds() {
            fetch('/api/certificate-ids')
            .then(response => response.json())
            .then(data => {
                const certificatesList = document.getElementById('certificatesList');
                if (data.length > 0) {
                    certificatesList.innerHTML = '';
                    data.forEach(certId => {
                        const div = document.createElement('div');
                        div.className = 'certificate-item';
                        div.textContent = certId;
                        div.style.cursor = 'pointer';
                        div.onclick = function() {
                            document.getElementById('certificateId').value = certId;
                        };
                        certificatesList.appendChild(div);
                    });
                } else {
                    certificatesList.innerHTML = '<p>No certificates found.</p>';
                }
            })
            .catch(error => {
                document.getElementById('certificatesList').innerHTML = '<p>Error loading certificates.</p>';
            });
        }

        // Application form submission
        document.getElementById('applicationForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                userName: document.getElementById('userName').value,
                email: document.getElementById('email').value,
                collegeName: document.getElementById('collegeName').value,
                collegeEnrollmentNumber: document.getElementById('collegeEnrollmentNumber').value,
                phoneNumber: document.getElementById('phoneNumber').value
            };

            fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                const messageDiv = document.getElementById('message');
                if (data.certificateId) {
                    messageDiv.innerHTML = '<div class="success">' +
                        '<h3>Application Submitted Successfully!</h3>' +
                        '<p>Your Certificate ID: <strong>' + data.certificateId + '</strong></p>' +
                        '<p>Please save this ID for verification purposes.</p>' +
                        '</div>';
                    document.getElementById('applicationForm').reset();
                } else if (data.error) {
                    messageDiv.innerHTML = '<div class="error">' +
                        '<h3>Error</h3>' +
                        '<p>' + data.error + '</p>' +
                        '</div>';
                } else {
                    let errorMsg = '<div class="error"><h3>Validation Errors</h3><ul>';
                    for (let field in data) {
                        errorMsg += '<li>' + field + ': ' + data[field] + '</li>';
                    }
                    errorMsg += '</ul></div>';
                    messageDiv.innerHTML = errorMsg;
                }
            })
            .catch(error => {
                document.getElementById('message').innerHTML = '<div class="error">' +
                    '<h3>Error</h3>' +
                    '<p>An error occurred while submitting your application.</p>' +
                    '</div>';
            });
        });

        // Verification form submission
        document.getElementById('verificationForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const certificateId = document.getElementById('certificateId').value;

            fetch('/api/applications/' + certificateId)
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('verificationResult');
                if (data.error) {
                    resultDiv.innerHTML = '<div class="error">' +
                        '<h3>Verification Failed</h3>' +
                        '<p>' + data.error + '</p>' +
                        '</div>';
                } else {
                    resultDiv.innerHTML = '<div class="user-details">' +
                        '<h3>Certificate Verified Successfully</h3>' +
                        '<div class="detail-row">' +
                            '<span class="detail-label">Certificate ID:</span>' +
                            '<span class="detail-value">' + data.certificateId + '</span>' +
                        '</div>' +
                        '<div class="detail-row">' +
                            '<span class="detail-label">Full Name:</span>' +
                            '<span class="detail-value">' + data.userName + '</span>' +
                        '</div>' +
                        '<div class="detail-row">' +
                            '<span class="detail-label">Email:</span>' +
                            '<span class="detail-value">' + data.email + '</span>' +
                        '</div>' +
                        '<div class="detail-row">' +
                            '<span class="detail-label">College Name:</span>' +
                            '<span class="detail-value">' + data.collegeName + '</span>' +
                        '</div>' +
                        '<div class="detail-row">' +
                            '<span class="detail-label">Enrollment Number:</span>' +
                            '<span class="detail-value">' + data.collegeEnrollmentNumber + '</span>' +
                        '</div>' +
                        '<div class="detail-row">' +
                            '<span class="detail-label">Phone Number:</span>' +
                            '<span class="detail-value">' + data.phoneNumber + '</span>' +
                        '</div>' +
                        '</div>';
                }
            })
            .catch(error => {
                document.getElementById('verificationResult').innerHTML = '<div class="error">' +
                    '<h3>Error</h3>' +
                    '<p>An error occurred while verifying the certificate.</p>' +
                    '</div>';
            });
        });
