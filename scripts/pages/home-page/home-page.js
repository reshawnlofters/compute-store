import { products } from '../../../data/home-page.js';
import { formatCurrency } from '../../shared/format-currency.js';
import { addProductToCart, calculateCartQuantity } from '../../../data/checkout-page.js';

const productsGrid = document.querySelector('.products-grid');
const productPopupContainer = document.querySelector('.product-popup-container');
const searchBar = document.querySelector('.search-bar');

function generateProductsHTML() {
    let productsHTML = '';

    products.forEach((product) => {
        productsHTML += `
            <div class="product-container product-container-${product.id}">
                <div class="product-image-container">
                    <img class="product-image" src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                    ${product.name}
                </div>

                <div class="product-price">
                    ${formatCurrency(product.priceInCents)}
                </div>

                <div class="add-product-to-cart-container">
                    <div class="input-product-quantity-container">
                        <div class="product-quantity-controls-container">
                            <button class="decrease-product-quantity-button" data-product-id="${
                                product.id
                            }">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                            <div class="product-quantity-count" data-product-id="${product.id}">
                                0
                            </div>
                            <button class="increase-product-quantity-button" data-product-id="${
                                product.id
                            }">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                            <div class="vr"></div>
                        </div>
                    </div>
                    <button class="add-product-to-cart-button" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>`;
    });

    if (productsGrid) {
        productsGrid.innerHTML = productsHTML;
        attachEventListeners();
    }
}

generateProductsHTML();

/**
 * Attaches a click event listener to the 'productsGrid' element, which represents the
 * container for all products. Handles interactions with "Add to Cart," "Increase Quantity,"
 * and "Decrease Quantity" buttons. Updates product quantity and triggers relevant actions,
 * such as adding the product to the cart and displaying confirmation messages.
 */
function attachEventListeners() {
    productsGrid.addEventListener('click', (event) => {
        const targetButton = event.target.closest(
            '.add-product-to-cart-button, .increase-product-quantity-button, .decrease-product-quantity-button'
        );

        if (targetButton) {
            const productId = targetButton.dataset.productId;
            const productContainer = targetButton.closest('.product-container');
            const productQuantityElement =
                productContainer.querySelector('.product-quantity-count');

            let productQuantity = parseInt(productQuantityElement.textContent, 10);

            if (targetButton.classList.contains('add-product-to-cart-button')) {
                // Add to Cart button clicked
                setTimeout(() => {
                    if (productQuantity > 0) {
                        addProductToCart(productId, productQuantity);
                        updateCartQuantityDisplay();
                        displayAddedProductToCartMessage(productId);
                    }
                    productQuantityElement.textContent = 0;
                }, 500);
            } else if (targetButton.classList.contains('increase-product-quantity-button')) {
                // Increase Quantity button clicked
                productQuantity++;
            } else if (targetButton.classList.contains('decrease-product-quantity-button')) {
                // Decrease Quantity button clicked
                productQuantity = Math.max(0, productQuantity - 1);
            }

            productQuantityElement.textContent = productQuantity;
        }
    });
}

function updateCartQuantityDisplay() {
    const cartQuantity = calculateCartQuantity();
    document.querySelector('.cart-quantity-count').innerHTML = cartQuantity;
}

updateCartQuantityDisplay();

const addedProductToCartMessageTimeouts = {};

/**
 * Temporarily updates the innerHTML of the specified "Add to Cart" button to display
 * an "Added" message, and reverts it back after a timeout for a smooth transition.
 * @param {string} productId - The unique identifier of the product added to the cart.
 */
function displayAddedProductToCartMessage(productId) {
    const button = document.querySelector(
        `.add-product-to-cart-button[data-product-id="${productId}"]`
    );

    // Clear any previous timeouts
    const previousTimeout = addedProductToCartMessageTimeouts[productId];
    if (previousTimeout) {
        clearTimeout(previousTimeout);
    }

    // Display "Added" message
    button.innerHTML = 'Added';

    // Set a timeout to revert the innerHTML back to 'Add to Cart'
    const timeoutId = setTimeout(() => {
        button.innerHTML = 'Add to Cart';
    }, 1000);

    // Store the timeoutId for later reference
    addedProductToCartMessageTimeouts[productId] = timeoutId;
}

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

/**
 * Attaches a scroll event listener to the page.
 * Disappears the promotion header when a user scrolls down.
 */
window.addEventListener('load', () => {
    const promoHeader = document.querySelector('.promo-header-container');
    const header = document.querySelector('.header-container');

    // Function to adjust headers based on scroll position
    function adjustHeaderOnScroll() {
        if (window.scrollY > 0) {
            if (promoHeader) {
                promoHeader.style.top = '-45px';
            }
            if (header) {
                header.style.top = '0';
            }
        } else {
            if (promoHeader) {
                promoHeader.style.top = '0';
            }
            if (header) {
                header.style.top = '45px';
            }
        }
    }

    // Throttle scroll event using requestAnimationFrame
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                adjustHeaderOnScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
});

/**
 * Smooth scroll to the products section when the "Shop Now" button is clicked.
 */
document.addEventListener('DOMContentLoaded', () => {
    const shopNowButton = document.querySelector('.shop-now-button');

    if (shopNowButton) {
        shopNowButton.addEventListener('click', () => {
            window.scrollTo({
                top: 700,
                behavior: 'smooth',
            });
        });
    }
});

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
