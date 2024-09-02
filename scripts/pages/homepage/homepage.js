/*
    Compute Store (E-commerce Store Simulator)

    Copyright © 2024 Reshawn Lofters

    This file is part of the Compute Store project, which is licensed under a Custom License.
    Please see the LICENSE file in the root of this project repository for full license details.
*/

import { products } from '../../../data/homepage.js';
import { findProductByName, formatCurrency } from '../../shared/utils.js';
import { addProductToCart, calculateQuantityOfCartItems } from '../../../data/checkout-page.js';
import { addProductToWishList, isProductAlreadyInWishList } from '../checkout-page/cart.js';
import { removeWishListItem } from '../wish-list-page/wish-list.js';

const productsGrid = document.querySelector('.products-grid');
const addedProductToCartMessageTimeouts = {};
const shopNowButton = document.querySelector('.shop-now-button');
const promoSectionBackground = document.querySelector('.promo-section-background');
const promoSectionBackgrounds = [
    'images/backgrounds/apple-airpods-max-background-formal.jpg',
    'images/backgrounds/logitech-mx-master-3-background-casual.jpg',
    'images/backgrounds/apple-iphone-background-formal.png',
    'images/backgrounds/apple-airpods-pro-background-casual.jpg',
    'images/backgrounds/beats-headphones-background-casual.jpg',
    'images/backgrounds/apple-airpods-max-background-casual.jpg',
    'images/backgrounds/apple-ipad-background-formal.webp',
];

function generateProductsHTML() {
    let productsHTML = '';

    products.forEach((product) => {
        productsHTML += `
            <div class='product-container product-container-${product.id}'>
                <div class='product-image-container'>
                    <img class='product-image' src='${product.image}' alt='product image'>
                </div>
                
                <div class='product-info-grid'>
                    <div>
                        <div class='product-name limit-text-to-2-lines'>
                            ${product.name}
                        </div>
                        <div class='product-price'>
                            ${formatCurrency(product.priceInCents)}
                        </div>
                    </div>
                    <img class='wish-list-icon' src='images/icons/unsaved-wish-list-item.png' alt='wish list icon'>
                </div>

                <div class='add-product-to-cart-container'>
                    <div class='input-product-quantity-container'>
                        <div class='product-quantity-controls-container'>
                            <button class='decrease-product-quantity-button' data-product-id='${
                                product.id
                            }'>
                                <i class='bi bi-dash-lg'></i>
                            </button>
                            <div class='product-quantity-count' data-product-id='${product.id}'>
                                0
                            </div>
                            <button class='increase-product-quantity-button' data-product-id='${
                                product.id
                            }'>
                                <i class='bi bi-plus-lg'></i>
                            </button>
                            <div class='vr'></div>
                        </div>
                    </div>
                    <button class='add-product-to-cart-button' data-product-id='${product.id}'>
                        Add to Cart
                    </button>
                </div>
            </div>`;
    });

    if (productsGrid) {
        productsGrid.innerHTML = productsHTML;
        addEventListenersToProductsGrid();
    }
}

generateProductsHTML();

/**
 * Adds event listeners to handle adding a product to the cart, increasing and decreasing product quantity.
 * - If the 'add to cart' button is clicked, the product is added to the cart.
 * - If the 'increase product quantity' button is clicked, the product quantity is increased.
 * - If the 'decrease product quantity' button is clicked, the product quantity is decreased.
 */
function addEventListenersToProductsGrid() {
    productsGrid.addEventListener('click', (event) => {
        const button = event.target.closest(
            '.add-product-to-cart-button, .increase-product-quantity-button, .decrease-product-quantity-button'
        );

        if (button) {
            const productId = button.dataset.productId;
            const productContainer = button.closest('.product-container');
            const productQuantityElement =
                productContainer.querySelector('.product-quantity-count');
            let productQuantity = parseInt(productQuantityElement.textContent, 10);

            if (button.classList.contains('add-product-to-cart-button')) {
                // Add the product to the cart
                setTimeout(() => {
                    if (productQuantity > 0) {
                        addProductToCart(productId, productQuantity);
                        updateCartItemsQuantityDisplay();
                        displayAddedProductToCartMessage(productId);
                    }
                    productQuantityElement.textContent = 0;
                }, 500);
            } else if (button.classList.contains('increase-product-quantity-button')) {
                productQuantity++; // Increase the product quantity
            } else if (button.classList.contains('decrease-product-quantity-button')) {
                productQuantity = Math.max(0, productQuantity - 1);  // Decrease the product quantity
            }

            productQuantityElement.textContent = productQuantity;
        }
    });
}

function updateCartItemsQuantityDisplay() {
    document.querySelector('.cart-items-quantity').innerHTML = `${calculateQuantityOfCartItems()}`;
}

updateCartItemsQuantityDisplay();

function displayAddedProductToCartMessage(productId) {
    const button = document.querySelector(
        `.add-product-to-cart-button[data-product-id='${productId}']`
    );

    // Clear any previous timeouts
    const previousTimeout = addedProductToCartMessageTimeouts[productId];
    if (previousTimeout) {
        clearTimeout(previousTimeout);
    }

    button.innerHTML = 'Added'; // Display the message

    // Set a timeout to revert the inner HTML and store it for later reference
    addedProductToCartMessageTimeouts[productId] = setTimeout(() => {
        button.innerHTML = 'Add to Cart';
    }, 1000);
}

function adjustHomepageHeaderOnScroll() {
    const promoHeaderContainer = document.querySelector('.promo-header-container');
    const headerGrid = document.querySelector('.header-grid');

    if (window.scrollY > 0) {
        if (promoHeaderContainer) promoHeaderContainer.style.top = '-45px';
        if (headerGrid) headerGrid.style.top = '0';
    } else {
        if (promoHeaderContainer) promoHeaderContainer.style.top = '0';
        if (headerGrid) headerGrid.style.top = '45px';
    }
}

/**
 * Adjusts the appearance of the homepage header based on the scroll position.
 * Removes the promotion header when the user scrolls down.
 */
window.addEventListener('load', () => {
    adjustHomepageHeaderOnScroll();

    // Throttle the scroll event using the `requestAnimationFrame` method
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                adjustHomepageHeaderOnScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
});

/**
 * Handles the `shop-now-button` click event.
 * - If the button is clicked, the page scrolls to the 'featured products' section.
 */
function handleShopNowButtonClick() {
    window.scrollTo({
        top: 700,
        behavior: 'smooth',
    });
}

if (shopNowButton) {
    shopNowButton.addEventListener('click', handleShopNowButtonClick);
}

/**
 * Handles the 'save product to wish list' functionality.
 * - Listens for the DOMContentLoaded event before setting wish list icon interactions.
 * - Defines functions to update the wish list icon appearance on mouseover and mouseout events.
 * - Handles the click event for adding a product to the wish list.
 * - Toggles the wish list icon between 'saved' and 'unsaved' states.
 * - Initializes event listeners for mouseover, mouseout, and click events for each wish list icon.
 */
document.addEventListener('DOMContentLoaded', () => {
    const wishListIcons = document.querySelectorAll('.wish-list-icon');

    function updateSaveToWishListIconOnMouseover(icon) {
        icon.src = 'images/icons/saved-wish-list-item.png'; // Display the 'saved' icon
    }

    function updateSaveToWishListIconOnMouseout(icon) {
        updateAddToWishListIcon(icon);
    }

    function handleSaveToWishListButtonClick(icon) {
        const productContainer = icon.closest('.product-container');
        const productName = productContainer
            .querySelector('.product-name')
            .textContent.toLowerCase()
            .trim();
        const matchingProduct = findProductByName(productName);

        if (matchingProduct) {
            toggleWishListItem(icon, matchingProduct);
        } else {
            console.error('Product not found.');
        }
    }

    /**
     * Toggles a product's presence in the wish list.
     * - If the product is already in the wish list, it removes it; otherwise, it adds it.
     * @param {Element} icon - The icon element representing the wish list action.
     * @param {Object} matchingProduct - The product object being toggled in the wish list.
     */
    function toggleWishListItem(icon, matchingProduct) {
        if (isProductAlreadyInWishList(matchingProduct.id)) {
            removeWishListItem(matchingProduct.id);
        } else {
            addProductToWishList(matchingProduct.id);
        }

        updateAddToWishListIcon(icon);
    }

    function updateAddToWishListIcon(icon) {
        const productContainer = icon.closest('.product-container');
        const productName = productContainer
            .querySelector('.product-name')
            .textContent.toLowerCase()
            .trim();
        const matchingProduct = findProductByName(productName);

        if (matchingProduct && isProductAlreadyInWishList(matchingProduct.id)) {
            icon.src = 'images/icons/saved-wish-list-item.png'; // Display 'saved' icon
        } else {
            icon.src = 'images/icons/unsaved-wish-list-item.png'; // Display 'unsaved' icon
        }
    }

    wishListIcons.forEach((icon) => {
        icon.addEventListener('mouseover', () => updateSaveToWishListIconOnMouseover(icon));
        icon.addEventListener('mouseout', () => updateSaveToWishListIconOnMouseout(icon));
        icon.addEventListener('click', () => handleSaveToWishListButtonClick(icon));

        updateAddToWishListIcon(icon);
    });
});

/**
 * Handles the carousel effect for the promo section background.
 * - Changes the background image of the promo section after an interval.
 * - Applies a smooth transition effect between background changes.
 */
function handlePromoSectionBackgroundCarousel() {
    let index = -1;

    const changeBackground = () => {
        // Increment index and ensure looping through backgrounds
        index = (index + 1) % promoSectionBackgrounds.length;

        promoSectionBackground.style.opacity = '0';

        setTimeout(() => {
            promoSectionBackground.src = promoSectionBackgrounds[index];
            promoSectionBackground.style.opacity = '1';
        }, 500) // 0.5 seconds
    }

    setInterval(changeBackground, 7500); // 7.5 seconds
}

if (promoSectionBackground) {
    window.addEventListener('DOMContentLoaded', handlePromoSectionBackgroundCarousel);
}
