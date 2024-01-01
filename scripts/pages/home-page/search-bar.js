import { products } from '../../../data/home-page.js';
import { findProductByName } from '../../shared/utils.js';

const searchBar = document.querySelector('.search-bar');
const searchDropdown = document.querySelector('.search-dropdown');
const searchButton = document.querySelector('.search-button');

function handleSearchBar() {
    const query = searchBar.value.toLowerCase();
    const matchingProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query)
    );

    generateSearchBarDropdown(matchingProducts);

    if (query.trim() === '') {
        searchBar.style.background = '#e3e3e3';
        searchBar.style.border = 'none';
    } else {
        searchBar.style.background = 'white';
        searchBar.style.border = '1px solid #ccc';
    }
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

function handleSearchButton() {
    const query = searchBar.value.toLowerCase();
    const matchingProduct = findProductByName(query);

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
    clearSearchBar();
}

searchButton.addEventListener('click', handleSearchButton);

function clearSearchBar() {
    searchBar.value = '';
}

// Close the search dropdown when a click is outside of it
document.addEventListener('click', (event) => {
    if (!event.target.matches('.search-bar') && !event.target.matches('.search-dropdown-item')) {
        searchDropdown.style.display = 'none';
    }
});

// Close the search bar when leaving the page
document.querySelector('.header-orders-link').addEventListener('click', clearSearchBar);
document.querySelector('.header-checkout-link').addEventListener('click', clearSearchBar);

// Search for a product using the "Enter" key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && searchBar.value !== '') {
        handleSearchButton();
    }
});
