/*
    Compute Store (E-commerce Store Simulator)

    Copyright © 2024 Reshawn Lofters

    This file is part of the Compute Store project, which is licensed under a Custom License.
    Please see the LICENSE file in the root of this project repository for full license details.
*/

const navMenu = document.querySelector('.nav-menu');
const openNavMenuIcon = document.getElementById('openNavMenuIcon');
const closeNavMenuIcon = document.getElementById('closeNavMenuIcon');

if (openNavMenuIcon) {
    openNavMenuIcon.addEventListener('click', () => {
        navMenu.style.right = '0';
        closeNavMenuIcon.style.display = 'block';
    });
} else {
    console.error('Open navigation menu icon not found.')
}

if (closeNavMenuIcon) {
    closeNavMenuIcon.addEventListener('click', () => {
        navMenu.style.right = '-250px';
    });
} else {
    console.error('Close navigation menu icon not found.')
}
