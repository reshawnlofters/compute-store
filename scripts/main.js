import { products } from '../data/products.js';
import { formatCurrency } from './utils/format-currency.js';
import { addCartItem, calculateCartQuantity } from '../data/cart.js';

/* This function generates the HTML for each product in the `products` array. It iterates
through each product and concatenates the generated HTML to the `productsHTML` variable.*/
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

                <div class="added-to-cart js-added-to-cart-${product.id}">
                <img src="images/icons/checkmark.png">
                    Added
                </div>
                
                <button class="add-to-cart-button js-add-to-cart-button button-primary"
                data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>`;
    });

    // display the products on the page
    const productsGrid = document.querySelector('.js-products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = productsHTML;
    }
}

generateProductsHTML();

// This function updates the cart quantity displayed on the page
function updateCartQuantity() {
    // get the cart quantity
    const cartQuantity = calculateCartQuantity();

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

updateCartQuantity();

/* This code adds click event listeners to each "Add to Cart" button on the page.
When a button is clicked, the code retrieves the `productId` and gets the quantity 
selector value associated with product. */
document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;

        // get the quantity selector element value and convert it to a number
        const quantitySelectorValue = Number(
            document.querySelector(`.js-quantity-selector-${productId}`).value
        );

        addCartItem(productId, quantitySelectorValue);
        displayAddedMessage(productId);
        updateCartQuantity();

        // reset the quantity selector value
        document.querySelector(`.js-quantity-selector-${productId}`).value = 1;
    });
});

// object to store added message timeouts in the `displayAddedMessage` function
const addedMessageTimeouts = {};

/**
 * This function displays an added message for a specific product by adding a class to
 * temporarily make the message visible.
 * @param productId - The unique identifier of the product.
 * It is used to select the specific added message element associated with a product.
 */
function displayAddedMessage(productId) {
    // get the added message element
    let addedMessageElement = document.querySelector(
        `.js-added-to-cart-${productId}`
    );

    // add a class to the added message element to make it visible
    addedMessageElement.classList.add('added-to-cart-visible');

    // check for any previous added message timeouts
    const previousTimeoutId = addedMessageTimeouts[productId];

    // clear any previous timeouts
    if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
    }

    // set an added message timeout
    const timeoutId = setInterval(() => {
        // remove the class added to the added message element to make it invisible
        addedMessageElement.classList.remove('added-to-cart-visible');
    }, 2000);

    // add the added message `timeoutId` to the `addedMessageTimeouts` object
    addedMessageTimeouts[productId] = timeoutId;
}
