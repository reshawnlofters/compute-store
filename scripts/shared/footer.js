document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('footerContainer');
    const footerHtmlPath = 'footer.html';

    fetch(footerHtmlPath)
        .then((response) => response.text())
        .then((html) => {
            footerContainer.innerHTML = html;
            setEventListeners(); // Content is loaded
        })
        .catch((error) => console.error('Error fetching footer:', error));
});

function validateEmailAddress() {
    const emailInput = document.querySelector('.email-input');
    const email = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validMessage = document.querySelector('.valid-email-address-message');
    const invalidMessage = document.querySelector('.invalid-email-address-message');

    // Check if the email is valid
    if (email == '') {
        invalidMessage.textContent = 'Email address is required';
        invalidMessage.style.display = 'block';
        validMessage.style.display = 'none';
    } else if (!emailRegex.test(email)) {
        invalidMessage.textContent = 'Email address is invalid';
        invalidMessage.style.display = 'block';
        validMessage.style.display = 'none';
    } else {
        validMessage.style.display = 'block';
        invalidMessage.style.display = 'none';
    }

    emailInput.value = '';
}

function setEventListeners() {
    document.querySelector('.sign-up-button').addEventListener('click', validateEmailAddress);
    document.querySelector('.copy-right-notice-year').innerHTML = new Date().getFullYear();
}
