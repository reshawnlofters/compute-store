import {products} from '../../../data/homepage.js';
import {findProductByName} from '../../shared/utils.js';

const searchBar = document.querySelector('.search-bar');
const searchBarDropdownMenu = document.querySelector('.search-bar-dropdown-menu');
const searchButton = document.querySelector('.search-button');

/**
 * Handles the search bar functionality.
 * - Displays matching products by filtering the 'products' array with the query.
 * - Generates and displays the search bar dropdown menu with the matching products.
 * - Updates the search bar styles based on the state of the search bar.
 */
function handleSearchBarClick() {
    const query = searchBar.value.toLowerCase();
    const matchingProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query)
    );

    generateSearchBarDropdownMenu(matchingProducts);

    if (query.trim() === '') {
        searchBar.style.background = '#e3e3e3';
        searchBar.style.border = 'none';
    } else {
        searchBar.style.background = 'white';
        searchBar.style.border = '1px solid #ccc';
    }
}

if (searchBar) {
    searchBar.addEventListener('input', handleSearchBarClick);
}

/**
 * Generates a dropdown list of matching products based on the provided array.
 * - If no matching products are found, a default dropdown is displayed.
 * @param {Array} matchingProducts - The array of products to be displayed in the dropdown menu.
 */
function generateSearchBarDropdownMenu(matchingProducts) {
    if (matchingProducts.length > 0) {
        const numberOfItemsToDisplay = matchingProducts.slice(0, 10);
        searchBarDropdownMenu.innerHTML = numberOfItemsToDisplay
            .map((product) => `<div class="search-bar-dropdown-menu-item">${product.name}</div>`)
            .join('');
        searchBarDropdownMenu.style.padding = '10px';
        searchBarDropdownMenu.style.display = 'block';

        // Add click event listeners to the search dropdown menu items
        const searchBarDropdownMenuItems = document.querySelectorAll('.search-bar-dropdown-menu-item');
        searchBarDropdownMenuItems.forEach((item) => {
            item.addEventListener('click', () => {
                searchBar.value = item.textContent;
                searchBarDropdownMenu.style.display = 'none';
            });
        });
    } else {
        searchBarDropdownMenu.innerHTML = 'No results could be found';
        searchBarDropdownMenu.style.padding = '20px';
    }
}

/**
 * Handles the "search" button click event in the search bar.
 * - If a matching product is found, the page scrolls to it.
 * - Checks if smooth scrolling is supported by the browser.
 */
function handleSearchButtonClick() {
    const query = searchBar.value.toLowerCase();
    const matchingProduct = findProductByName(query);

    if (matchingProduct) {
        const productContainer = document.querySelector(
            `[data-product-id="${matchingProduct.id}"]`
        );

        if (productContainer) {
            const scrollAdjustment = -500;
            const offset = productContainer.offsetTop + scrollAdjustment;

            // Check if the offset is valid
            if (Number.isFinite(offset)) {
                // Scroll to the product with smooth scrolling if supported
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scroll({
                        top: offset,
                        behavior: 'smooth',
                    });
                } else {
                    window.scrollTo(0, offset);
                }
            } else {
                console.error('Invalid scroll offset.');
            }
        }
    } else {
        console.error("Matching product not found.");
        return;
    }

    searchBarDropdownMenu.style.display = 'none'; // Clear the search bar dropdown menu
    clearSearchBar();
}

if (searchButton) {
    searchButton.addEventListener('click', handleSearchButtonClick);
}

function clearSearchBar() {
    searchBar.value = '';
}

/**
 * Clears the search bar dropdown menu when a click is outside of it.
 */
document.addEventListener('click', (event) => {
    if (!event.target.matches('.search-bar') && !event.target.matches('.search-bar-dropdown-menu-item')) {
        searchBarDropdownMenu.style.display = 'none';
    }
});

/**
 * Adds click event listeners to clear the search bar when leaving the homepage.
 */
document.querySelectorAll('.header-orders-page-link, .header-checkout-page-link')
    .forEach(link => link.addEventListener('click', clearSearchBar));


/**
 * Handles searching for a product in the search bar using the "enter" key.
 * - If the key is pressed,the page scrolls to the product.
 */
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && searchBar.value !== '') {
        handleSearchButtonClick();
    }
});
