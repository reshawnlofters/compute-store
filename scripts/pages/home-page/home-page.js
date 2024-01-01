import { products } from '../../../data/home-page.js';
import { findProductByName, formatCurrency } from '../../shared/utils.js';
import { addProductToCart, calculateQuantityOfCartItems } from '../../../data/checkout-page.js';
import { addProductToWishList, isProductAlreadyInWishList } from '../checkout-page/cart.js';
import { removeWishListItem } from '../checkout-page/wish-list.js';

const productsGrid = document.querySelector('.products-grid');

function generateProductsHTML() {
    let productsHTML = '';

    products.forEach((product) => {
        productsHTML += `
            <div class="product-container product-container-${product.id}">
                <div class="product-image-container">
                    <img class="product-image" src="${product.image}">
                </div>
                
                <div class="product-info-grid">
                    <div>
                        <div class="product-name limit-text-to-2-lines">
                            ${product.name}
                        </div>
                        <div class="product-price">
                            ${formatCurrency(product.priceInCents)}
                        </div>
                    </div>
                    <img class="wish-list-icon" src="images/icons/unsaved.png">
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
        addEventListeners();
    }
}

generateProductsHTML();

/**
 * Adds a click event listener to 'productsGrid', the container of all products.
 * Handles interactions with "Add to Cart," "Increase Quantity,"
 * and "Decrease Quantity" buttons. Updates product quantity and triggers relevant actions,
 * such as adding the product to the cart and displaying confirmation messages.
 */
function addEventListeners() {
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
                        updateCartItemsQuantityDisplay();
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

function updateCartItemsQuantityDisplay() {
    const cartQuantity = calculateQuantityOfCartItems();
    document.querySelector('.cart-items-quantity').innerHTML = cartQuantity;
}

updateCartItemsQuantityDisplay();

const addedProductToCartMessageTimeouts = {};

function displayAddedProductToCartMessage(productId) {
    const button = document.querySelector(
        `.add-product-to-cart-button[data-product-id="${productId}"]`
    );

    // Clear any previous timeouts
    const previousTimeout = addedProductToCartMessageTimeouts[productId];
    if (previousTimeout) {
        clearTimeout(previousTimeout);
    }

    // Display message
    button.innerHTML = 'Added';

    // Set a timeout to revert the innerHTML
    const timeoutId = setTimeout(() => {
        button.innerHTML = 'Add to Cart';
    }, 1000);

    // Store the timeout ID for later reference
    addedProductToCartMessageTimeouts[productId] = timeoutId;
}

function adjustHeaderOnScroll() {
    const promoHeader = document.querySelector('.promo-header-container');
    const header = document.querySelector('.header-container');

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

/**
 * Adds a scroll event listener to remove the promotion header on down scroll.
 */
window.addEventListener('load', () => {
    adjustHeaderOnScroll();

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
 * Scrolls to the featured products section when the "Shop Now" button is clicked.
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

/**
 * Handles the "Save to Wish List" button functionality.
 * - Listens for the DOMContentLoaded event before setting up the wish list icon interactions.
 * - Defines functions to update the wish list icon appearance on mouseover and mouseout events.
 * - Handles the click event on the "Add to Wish List" button, toggling the product's presence in the wish list.
 * - Toggles the wish list icon between "saved" and "unsaved" states based on the product's wish list status.
 * - Initializes event listeners for mouseover, mouseout, and click events on each wish list icon.
 */
document.addEventListener('DOMContentLoaded', () => {
    const wishListIcons = document.querySelectorAll('.wish-list-icon');

    function updateSaveToWishListIconOnMouseover(icon) {
        icon.src = 'images/icons/saved.png';
    }

    function updateSaveToWishListIconOnMouseout(icon) {
        updateAddtoWishListIcon(icon);
    }

    function handleSaveToWishListButton(icon) {
        const productContainer = icon.closest('.product-container');
        const productName = productContainer
            .querySelector('.product-name')
            .textContent.toLowerCase()
            .trim();
        const matchingProduct = findProductByName(productName);

        if (matchingProduct) {
            toggleWishListItem(icon, matchingProduct);
        } else {
            console.error('Product not found');
        }
    }
    function toggleWishListItem(icon, matchingProduct) {
        if (isProductAlreadyInWishList(matchingProduct.id)) {
            removeWishListItem(matchingProduct.id);
        } else {
            addProductToWishList(matchingProduct.id);
        }

        updateAddtoWishListIcon(icon);
    }

    function updateAddtoWishListIcon(icon) {
        const productContainer = icon.closest('.product-container');
        const productName = productContainer
            .querySelector('.product-name')
            .textContent.toLowerCase()
            .trim();
        const matchingProduct = findProductByName(productName);

        if (matchingProduct && isProductAlreadyInWishList(matchingProduct.id)) {
            icon.src = 'images/icons/saved.png';
        } else {
            icon.src = 'images/icons/unsaved.png';
        }
    }

    wishListIcons.forEach((icon) => {
        icon.addEventListener('mouseover', () => updateSaveToWishListIconOnMouseover(icon));
        icon.addEventListener('mouseout', () => updateSaveToWishListIconOnMouseout(icon));
        icon.addEventListener('click', () => handleSaveToWishListButton(icon));

        updateAddtoWishListIcon(icon);
    });
});
