import { products } from '../data/home-page.js';
import { formatCurrency } from './utils/format-currency.js';
import {
    addProductToCart,
    calculateCartQuantity,
} from '../data/checkout-page.js';

/**
 * Generates HTML for displaying products.
 * Iterates through the 'products' array to create product containers
 * that include images, names, prices, quantity controls, and add-to-cart buttons.
 * Appends the generated HTML to the 'productsGrid' element for display.
 */
function generateProductsHTML() {
    let productsHTML = '';

    products.forEach((product) => {
        productsHTML += `
            <div class="product-container product-container-${product.id}">
                <div class="product-image-container">
                    <img class="product-image"
                    src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                    ${product.name}
                </div>

                <div class="product-price">
                    $${formatCurrency(product.priceInCents)}
                </div>

                <div class="added-product-to-cart-message added-product-to-cart-message-${
                    product.id
                }">
                    <img src="images/icons/checkmark.png">
                    Added
                </div>
                
                <div class="add-product-to-cart-parent-container">
                    <div class="add-product-to-cart-container">
                        <div class="input-product-quantity-container">
                            <div class="product-quantity-controls-container">
                                <button class="decrease-product-quantity-button">-</button>
                                <div class="product-quantity-count product-quantity-count-${
                                    product.id
                                }">0</div>
                                <button class="increase-product-quantity-button">+</button>
                                <div class="vertical-rule"></div>
                            </div>
                            <div>
                                <button class="add-product-to-cart-button"
                                data-product-id="${product.id}">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = productsHTML;
    }
}
generateProductsHTML();

function updateCartQuantityDisplay() {
    const cartQuantity = calculateCartQuantity();

    document.querySelector('.cart-quantity').innerHTML = cartQuantity;
}
updateCartQuantityDisplay();

/**
 * Attaches a click event listener to the "add product to cart" buttons.
 * When a button is clicked, the code retrieves the 'productId' and the product quantity.
 * It then adds the product to the cart, updates the cart quantity display, and triggers 
 * a confirmation message display if the product quantity is greater than zero.
 * Finally, it resets the product quantity value to zero.
 */
document.querySelectorAll('.add-product-to-cart-button').forEach((button) => {
    button.addEventListener('click', () => {
        setTimeout(() => {
            const productId = button.dataset.productId;

            const productQuantity = Number(
                document.querySelector(`.product-quantity-count-${productId}`)
                    .textContent
            );

            addProductToCart(productId, productQuantity);
            updateCartQuantityDisplay();
            
            if (productQuantity > 0) {
                displayAddedProductToCartMessage(productId);
            }

            document.querySelector(
                `.product-quantity-count-${productId}`
            ).textContent = 0;
        }, 500);
    });
});

/**
 * Attaches a click event listener to the 'productsGrid' element, which represents the
 * container for all products. When a click event occurs, the code determines whether 
 * the clicked element is an "increase quantity" or "decrease quantity" button. When an 
 * "increase quantity" button is clicked, the code finds the corresponding product container,
 * retrieves and increments the product quantity, and updates the displayed quantity.
 * Similarly, when a "decrease quantity" button is clicked, it performs the reverse operation by
 * decreasing the product quantity, ensuring it doesn't go below zero.
 */
const productsGrid = document.querySelector('.products-grid');
if (productsGrid) {
    productsGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('increase-product-quantity-button')) {
            const productContainer = event.target.closest('.product-container');

            if (productContainer) {
                const productQuantityElement =
                    productContainer.querySelector('.product-quantity-count');
                let productQuantity = parseInt(
                    productQuantityElement.textContent,
                    10
                );

                productQuantity++;
                productQuantityElement.innerHTML = productQuantity;
            }
        } else if (
            event.target.classList.contains('decrease-product-quantity-button')
        ) {
            const productContainer = event.target.closest('.product-container');

            if (productContainer) {
                const productQuantityElement =
                    productContainer.querySelector('.product-quantity-count');
                let productQuantity = parseInt(
                    productQuantityElement.textContent,
                    10
                );

                productQuantity--;

                if (productQuantity < 0) {
                    productQuantity = 0;
                }

                productQuantityElement.innerHTML = productQuantity;
            }
        }
    });
}

// object to store added message timeouts in 'displayAddedProductToCartMessage' function
const addedMessageTimeouts = {};

/**
 * Temporarily displays an "Added Product to Cart" message by adding a class to the
 * message element to make it visibile.
 * @param productId - The unique identifier of the product added to the cart.
 */
function displayAddedProductToCartMessage(productId) {
    let addedMessageElement = document.querySelector(
        `.added-product-to-cart-message-${productId}`
    );

    if (addedMessageElement) {
        addedMessageElement.classList.add(
            'added-product-to-cart-message-visible'
        );

        // check for any previous timeouts
        const previousTimeoutId = addedMessageTimeouts[productId];

        if (previousTimeoutId) {
            clearTimeout(previousTimeoutId);
        }

        const timeoutId = setInterval(() => {
            addedMessageElement.classList.remove(
                'added-product-to-cart-message-visible'
            );
        }, 2000);

        // add the added message 'timeoutId' to the 'addedMessageTimeouts' object
        addedMessageTimeouts[productId] = timeoutId;
    }
}

function clearSearchBarOnPageLeave() {
    const searchBar = document.querySelector('.search-bar');

    window.addEventListener('beforeunload', (event) => {
        if (searchBar.value.trim() !== '') {
            event.preventDefault();
            searchBar.value = '';
        }
    });
}
clearSearchBarOnPageLeave();

/**
 * Attaches a scroll event listener to the page. When a user scrolls down, the
 * 'homeHeaderContainer' and 'homeHeaderOfferContainer' elements are controlled
 * to achieve a fixed header effect.
 */
window.addEventListener('load', () => {
    const homeHeaderContainer = document.querySelector(
        '.home-header-container'
    );
    const homeHeaderOfferContainer = document.querySelector(
        '.home-header-offer-container'
    );

    // Function to adjust the header elements based on scroll position
    function adjustHeaderOnScroll() {
        if (window.scrollY > 0) {
            homeHeaderContainer.style.position = 'fixed';
            homeHeaderContainer.style.top = '0';
            homeHeaderOfferContainer.style.display = 'none';
        } else {
            homeHeaderContainer.style.position = 'relative';
            homeHeaderContainer.style.top = '35px';
            homeHeaderOfferContainer.style.display = 'flex';
        }
    }
    adjustHeaderOnScroll();

    window.addEventListener('scroll', () => {
        adjustHeaderOnScroll();
    });
});

// Displays the current year in the footer copyright notice
document.querySelector('.current-year').innerHTML = new Date().getFullYear();
