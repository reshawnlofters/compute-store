import { products } from '../../../data/home-page.js';

const productsGrid = document.querySelector('.products-grid');
const productPopupContainer = document.querySelector('.product-popup-container');

function openProductPopup(matchingProduct) {
    generateProductPopup(matchingProduct.id);
    productPopupContainer && (productPopupContainer.style.display = 'block');
}

function closeProductPopup() {
    productPopupContainer && (productPopupContainer.style.display = 'none');
}

document.addEventListener('scroll', () => {
    if (window.scrollY < 700) {
        closeProductPopup();
    }
});

function generateProductPopup(productId) {
    const matchingProduct = products.find((product) => product.id === productId);

    if (!matchingProduct) {
        console.error(`Product with ID ${productId} not found.`);
        return;
    }

    if (productPopupContainer) {
        let productPopupHTML = `
            <div class="product-popup-image">
                <img src="${matchingProduct.image}" alt="${matchingProduct.name}">
            </div>
            <button class="close-product-popup-button">
                <i class="bi bi-x-lg"></i>
            </button>`;

        productPopupContainer.innerHTML = productPopupHTML;

        // Event listener for the close button
        const closeProductPopupButton = productPopupContainer.querySelector(
            '.close-product-popup-button'
        );
        if (closeProductPopupButton) {
            closeProductPopupButton.addEventListener('click', closeProductPopup);
        }
    }
}

function handleProductImageClick(event) {
    const productImageContainer = event.target.closest('.product-image-container');

    if (productImageContainer) {
        const productName = productImageContainer
            .closest('.product-container')
            .querySelector('.product-name')
            .textContent.trim();
        const matchingProduct = products.find((product) => product.name === productName);

        if (matchingProduct) {
            openProductPopup(matchingProduct);
        }
    }
}

productsGrid && productsGrid.addEventListener('click', handleProductImageClick);
