import { products } from '../../../data/home-page.js';
import { findProductById, findProductByName } from '../../shared/utils.js';

const productsGrid = document.querySelector('.products-grid');
const productPopupContainer = document.querySelector('.product-popup-container');

function openProductPopup(matchingProduct) {
    generateProductPopup(matchingProduct.id);
    if (productPopupContainer) productPopupContainer.style.display = 'block';
}

function closeProductPopup() {
    if (productPopupContainer) productPopupContainer.style.display = 'none';
}

// Add an event listener to close the product popup at a scroll position
document.addEventListener('scroll', () => {
    if (window.scrollY < 700) {
        closeProductPopup();
    }
});

function generateProductPopup(productId) {
    const matchingProduct = findProductById(productId);

    if (!matchingProduct) return;

    if (productPopupContainer) {
        let productPopupHTML = `
            <div class="product-popup-image">
                <img src="${matchingProduct.image}" alt="${matchingProduct.name}">
            </div>
            <button class="close-product-popup-button">
                <i class="bi bi-x-lg"></i>
            </button>`;

        productPopupContainer.innerHTML = productPopupHTML;

        // Add event listener to the close button
        const closeProductPopupButton = productPopupContainer.querySelector(
            '.close-product-popup-button'
        );
        if (closeProductPopupButton)
            closeProductPopupButton.addEventListener('click', closeProductPopup);
    }
}

function handleProductImageClick(event) {
    const productImageContainer = event.target.closest('.product-image-container');

    if (productImageContainer) {
        const productName = productImageContainer
            .closest('.product-container')
            .querySelector('.product-name')
            .textContent.toLowerCase()
            .trim();
        const matchingProduct = findProductByName(productName);

        if (matchingProduct) openProductPopup(matchingProduct);
    }
}

if (productsGrid) productsGrid.addEventListener('click', handleProductImageClick);
