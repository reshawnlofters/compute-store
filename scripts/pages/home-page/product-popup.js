import {findProductById, findProductByName} from '../../shared/utils.js';

const productsGrid = document.querySelector('.products-grid');
const productPopupContainer = document.querySelector('.product-popup-container');

/**
 * Displays a popup for a product.
 * @param {Object} matchingProduct - The product object to display in the popup.
 */
function openProductPopup(matchingProduct) {
    generateProductPopup(matchingProduct.id);

    if (productPopupContainer) {
        productPopupContainer.style.display = 'block';
    }
}

/**
 * Closes a popup for a product.
 */
function closeProductPopup() {
    if (productPopupContainer) {
        productPopupContainer.style.display = 'none';
    }
}

/**
 * Adds an event listener to close a popup for a product based on the scroll position.
 */
document.addEventListener('scroll', () => {
    if (window.scrollY < 700) {
        closeProductPopup();
    }
});

function generateProductPopup(productId) {
    const matchingProduct = findProductById(productId);

    if (!matchingProduct) {
        console.error('Product not found.');
        return;
    }

    if (productPopupContainer) {
        productPopupContainer.innerHTML = `
            <div class="product-popup-image">
                <img src="${matchingProduct.image}" alt="${matchingProduct.name}">
            </div>
            <button class="close-product-popup-button">
                <i class="bi bi-x-lg"></i>
            </button>`;

        const closeProductPopupButton = productPopupContainer.querySelector(
            '.close-product-popup-button'
        );

        // Add an event listener to the "close product popup" button
        if (closeProductPopupButton)
            closeProductPopupButton.addEventListener('click', closeProductPopup);
    }
}

/**
 * Handles the "open product popup" click event.
 * @param {Event} event - The click event object.
 */
function handleProductImageClick(event) {
    const productImageContainer = event.target.closest('.product-image-container');

    if (productImageContainer) {
        const productName = productImageContainer
            .closest('.product-container')
            .querySelector('.product-name')
            .textContent.toLowerCase()
            .trim();
        const matchingProduct = findProductByName(productName);

        if (matchingProduct) {
            openProductPopup(matchingProduct);
        } else {
            console.error('Product not found.');
        }
    }
}

if (productsGrid) {
    productsGrid.addEventListener('click', handleProductImageClick);
}
