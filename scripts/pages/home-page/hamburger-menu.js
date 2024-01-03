const navMenu = document.querySelector('.nav-menu');
const openNavMenuIcon = document.getElementById('openNavMenuIcon');
const closeNavMenuIcon = document.getElementById('closeNavMenuIcon');

openNavMenuIcon.addEventListener('click', () => {
    navMenu.style.right = '0';
    closeNavMenuIcon.style.display = 'block';
});

closeNavMenuIcon.addEventListener('click', () => {
    navMenu.style.right = '-200px';
});