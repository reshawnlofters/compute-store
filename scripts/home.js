import { products } from '../data/home-page.js';
import { formatCurrency } from './utils/format-currency.js';
import {
    addProductToCart,
    calculateCartQuantity,
} from '../data/checkout-page.js';

/**
 * Generates HTML for displaying products.
 * Locates products in the 'products' array to access product details.
 */
function generateProductsHTML() {
    let productsHTML = '';

    products.forEach((product) => {
        productsHTML += `
            <div class="product-container">
                <div class="product-image-container">
                    <img class="product-image"
                    src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                    ${product.name}
                </div>

                <div class="product-rating-container">
                    <img class="product-rating-stars"
                    src="images/ratings/rating-${
                        product.rating.stars * 10
                    }.png">
                    <div class="product-rating-count link-primary">
                    ${product.rating.count}
                    </div>
                </div>

                <div class="product-price">
                    $${formatCurrency(product.priceInCents)}
                </div>

                <div class="product-quantity-container">
                    <select class="js-quantity-selector-${product.id}">
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    </select>
                </div>

                <div class="products-spacer"></div>

                <div class="added-product-to-cart js-added-product-to-cart-${
                    product.id
                }">
                <img src="images/icons/checkmark.png">
                    Added
                </div>
                
                <button class="add-to-cart-button js-add-to-cart-button button-primary"
                data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>`;
    });

    const productsGrid = document.querySelector('.js-products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = productsHTML;
    }
}
generateProductsHTML();

function updateCartQuantityDisplay() {
    const cartQuantity = calculateCartQuantity();

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}
updateCartQuantityDisplay();

/**
 * Attaches a click event listener to the "Add Product To Cart" buttons.
 * If a button is clicked, the code gets the 'productId' and quantity selector value.
 * It then adds the product to the cart and resets the quantity selector value.
 */
document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
    button.addEventListener('click', () => {
        setTimeout(() => {
            const productId = button.dataset.productId;

            const quantitySelectorValue = Number(
                document.querySelector(`.js-quantity-selector-${productId}`)
                    .value
            );

            addProductToCart(productId, quantitySelectorValue);
            displayAddedProductToCartMessage(productId);
            updateCartQuantityDisplay();

            document.querySelector(
                `.js-quantity-selector-${productId}`
            ).value = 1;
        }, 500);
    });
});

// object to store added message timeouts in 'displayAddedProductToCartMessage' function
const addedMessageTimeouts = {};

/**
 * Temporarily displays an "Added Product to Cart" message by adding a class to the
 * message element to make it visibile.
 * @param productId - The unique identifier of the product added to the cart.
 */
function displayAddedProductToCartMessage(productId) {
    let addedMessageElement = document.querySelector(
        `.js-added-product-to-cart-${productId}`
    );

    addedMessageElement.classList.add('added-product-to-cart-visible');

    // check for any previous timeouts
    const previousTimeoutId = addedMessageTimeouts[productId];

    if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
    }

    const timeoutId = setInterval(() => {
        addedMessageElement.classList.remove('added-product-to-cart-visible');
    }, 2000);

    // add the added message 'timeoutId' to the 'addedMessageTimeouts' object
    addedMessageTimeouts[productId] = timeoutId;
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
