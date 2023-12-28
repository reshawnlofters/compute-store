import { products } from '../../../data/home-page.js';

const searchBar = document.querySelector('.search-bar');
const searchDropdown = document.querySelector('.search-dropdown');
const searchButton = document.querySelector('.search-button');

function handleSearchBar() {
    const searchTerm = searchBar.value.toLowerCase();
    const matchingProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
    );

    generateSearchBarDropdown(matchingProducts);
}

searchBar.addEventListener('input', handleSearchBar);

function generateSearchBarDropdown(matchingProducts) {
    if (matchingProducts.length > 0) {
        const numItemsToDisplay = matchingProducts.slice(0, 10);

        const searchDropdownHTML = numItemsToDisplay
            .map((product) => `<div class="search-dropdown-item">${product.name}</div>`)
            .join('');

        searchDropdown.innerHTML = searchDropdownHTML;
        searchDropdown.style.display = 'block';

        // Add event listeners to the search dropdown items
        const searchDropdownItems = document.querySelectorAll('.search-dropdown-item');
        searchDropdownItems.forEach((item) => {
            item.addEventListener('click', () => {
                searchBar.value = item.textContent;
                searchDropdown.style.display = 'none';
            });
        });
    } else {
        searchDropdown.innerHTML = '';
        searchDropdown.style.display = 'none';
    }
}

// Close the search dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.matches('.search-bar') && !event.target.matches('.search-dropdown-item')) {
        searchDropdown.style.display = 'none';
    }
});

// Add an event listener for the input event on the search bar
searchBar.addEventListener('input', () => {
    if (searchBar.value.trim() === '') {
        searchBar.style.background = '#e3e3e3';
        searchBar.style.border = 'none';
    } else {
        searchBar.style.background = 'white';
        searchBar.style.border = '1px solid #ccc';
    }
});

function handleSearchButton() {
    const searchTerm = searchBar.value.toLowerCase();
    const matchingProduct = products.find((product) => product.name.toLowerCase() === searchTerm);

    // If a matching product is found, scroll to it with a pixel adjustment
    if (matchingProduct) {
        const productContainer = document.querySelector(
            `[data-product-id="${matchingProduct.id}"]`
        );

        if (productContainer) {
            const scrollAdjustment = -500;
            const offset = productContainer.offsetTop + scrollAdjustment;

            window.scroll({
                top: offset,
                behavior: 'smooth',
            });
        }
    }

    searchDropdown.style.display = 'none';
}

searchButton.addEventListener('click', handleSearchButton);

function clearSearchBarOnPageLeave() {
    if (searchBar) {
        window.addEventListener('beforeunload', (event) => {
            if (searchBar.value.trim() !== '') {
                event.preventDefault();
                searchBar.value = '';
            }
        });
    }
}

clearSearchBarOnPageLeave();
