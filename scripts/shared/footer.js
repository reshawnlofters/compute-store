/*
    Compute Store (E-commerce Store Simulator)

    Copyright © 2024 Reshawn Lofters

    This file is part of the Compute Store project, which is licensed under a Custom License.
    Please see the LICENSE file in the root of this project repository for full license details.
*/

import { clearInputField } from "./utils";

function fetchFooterHTML() {
    const footerContainer = document.getElementById('footerContainer');
    const footerHTMLPath = 'footer.html';

    fetch(footerHTMLPath)
        .then((response) => response.text())
        .then((html) => {
            footerContainer.innerHTML = html;
            manageFooter();
        })
        .catch((error) => console.error('Error fetching footer:', error));
}

document.addEventListener('DOMContentLoaded', fetchFooterHTML);

/**
 * Handles the "sign-up" button click event.
 * - If the button is clicked, the email inputted by the user is verified and UI displays are updated.
 */
function handleSignUpButtonClick() {
    const emailInput = document.querySelector('.email-input');
    const email = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmailMessage = document.querySelector('.valid-email-address-message');
    const invalidEmailMessage = document.querySelector('.invalid-email-address-message');

    if (email === '') {
        invalidEmailMessage.textContent = 'Email address is required';
        invalidEmailMessage.style.display = 'block';
        validEmailMessage.style.display = 'none';
    } else if (!emailRegex.test(email)) {
        invalidEmailMessage.textContent = 'Email address is invalid';
        invalidEmailMessage.style.display = 'block';
        validEmailMessage.style.display = 'none';
    } else {
        validEmailMessage.style.display = 'block';
        invalidEmailMessage.style.display = 'none';
    }

    clearInputField(emailInput);
}

/**
 * Handles adding a promo code using the "enter" key.
 * - If the key is pressed, the promo code is validated.
 */
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && document.querySelector('.email-input').value !== '') {
        handleSignUpButtonClick();
    }
})

/**
 * Manages the footer functionality.
 * - Adds a click event listener to the sign-up button to handle the sign-up click event.
 * - Updates the copyright notice year to the current year.
 */
function manageFooter() {
    document.querySelector('.sign-up-button').addEventListener('click', handleSignUpButtonClick);
    document.querySelector('.copyright-notice-year').innerHTML = `${new Date().getFullYear()}`;
}
