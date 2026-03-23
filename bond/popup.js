// Auto-generate and fill functionality for new registration form

const autoFillRegistrationForm = () => {
    const form = document.getElementById('registrationForm'); // Assuming the form has this ID
    if (form) {
        form.elements['username'].value = `user${Date.now()}`; // Auto-generate username
        form.elements['email'].value = `user${Date.now()}@example.com`; // Auto-generate email
        form.elements['password'].value = 'Password123'; // Example auto-generated password
        // Add more fields as necessary
    }
};

// Execute autofill on page load
document.addEventListener('DOMContentLoaded', autoFillRegistrationForm);