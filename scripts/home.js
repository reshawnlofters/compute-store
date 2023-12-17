import { products } from '../data/home-page.js';
import { formatCurrency } from './utils/format-currency.js';
import { addProductToCart, calculateCartQuantity } from '../data/checkout-page.js';

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
                    ${formatCurrency(product.priceInCents)}
                </div>

                <div class="add-product-to-cart-container">
                    <div class="input-product-quantity-container">
                        <div class="product-quantity-controls-container">
                            <button class="decrease-product-quantity-button">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                            <div class="product-quantity-count product-quantity-count-${
                                product.id
                            }">
                                0
                            </div>
                            <button class="increase-product-quantity-button">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                            <div class="vertical-rule"></div>
                        </div>
                    </div>
                    <button class="add-product-to-cart-button"
                    data-product-id="${product.id}">
                        Add to Cart
                    </button>
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

    document.querySelector('.cart-quantity-count').innerHTML = cartQuantity;
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
                document.querySelector(`.product-quantity-count-${productId}`).textContent
            );

            if (productQuantity > 0) {
                addProductToCart(productId, productQuantity);
                updateCartQuantityDisplay();
                displayAddedProductToCartMessage(productId);
            }

            document.querySelector(`.product-quantity-count-${productId}`).textContent = 0;
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
                let productQuantity = parseInt(productQuantityElement.textContent, 10);

                productQuantity++;
                productQuantityElement.innerHTML = productQuantity;
            }
        } else if (event.target.classList.contains('decrease-product-quantity-button')) {
            const productContainer = event.target.closest('.product-container');

            if (productContainer) {
                const productQuantityElement =
                    productContainer.querySelector('.product-quantity-count');
                let productQuantity = parseInt(productQuantityElement.textContent, 10);

                productQuantity--;

                if (productQuantity < 0) {
                    productQuantity = 0;
                }

                productQuantityElement.innerHTML = productQuantity;
            }
        }
    });
}

const addedProductToCartMessageTimeouts = {};

/**
 * Temporarily displays an "Added Product to Cart" message by updating the innerHTML of
 * the specified button element and managing a timeout for a smooth transition.
 *
 * @param {string} productId - The unique identifier of the product added to the cart.
 */
function displayAddedProductToCartMessage(productId) {
    const button = document.querySelector(
        `.add-product-to-cart-button[data-product-id="${productId}"]`
    );

    // Check for any previous timeouts and clear them
    const previousTimeouts = addedProductToCartMessageTimeouts[productId];
    if (previousTimeouts) {
        clearTimeout(previousTimeouts);
    }

    button.innerHTML = 'Added';

    // Set a timeout to revert the innerHTML back to 'Add to Cart'
    const timeoutId = setTimeout(() => {
        button.innerHTML = 'Add to Cart';
    }, 1000);

    // Store the timeoutId for later reference
    addedProductToCartMessageTimeouts[productId] = timeoutId;
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
 * Attaches a scroll event listener to the page.
 * Disappears the promotion header when a user scrolls down.
 */
window.addEventListener('load', () => {
    const promoHeader = document.querySelector('.promo-header-container');
    const header = document.querySelector('.header-container');

    // Function to adjust headers based on scroll position
    function adjustHeaderOnScroll() {
        if (window.scrollY > 0) {
            promoHeader.style.top = '-50px';
            header.style.top = '0';
        } else {
            promoHeader.style.top = '0';
            header.style.top = '50px';
        }
    }

    window.addEventListener('scroll', () => {
        adjustHeaderOnScroll();
    });
});

/**
 * Smooth scroll to the products section when the "Shop Now" button is clicked.
 */
document.addEventListener('DOMContentLoaded', () => {
    const shopNowButton = document.querySelector('.shop-now-button');
    const productsSectionContainer = document.getElementById('products-section-container');

    shopNowButton.addEventListener('click', () => {
        productsSectionContainer.scrollIntoView({ behavior: 'smooth' });
    });
});

// Displays the current year in the footer copyright notice
// document.querySelector('.current-year').innerHTML = new Date().getFullYear();
