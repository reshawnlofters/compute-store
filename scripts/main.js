import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { addToCart, calculateCartQuantity } from '../data/cart.js';

/* The code generates HTML markup for each product in the `products` array. It iterates
through each product and concatenates the generated HTML code to the `productsHTML` variable. The
generated HTML includes the product image, name, rating, price, quantity selector, "Added" message,
and an "Add to Cart" button. The generated HTML is stored in the `productsHTML` variable. */
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
            src="images/ratings/rating-${product.rating.stars * 10}.png">
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
document.querySelector('.js-products-grid').innerHTML = productsHTML;

// The function updates the cart quantity displayed on the page
function updateCartQuantity() {
    // get the cart quantity
    const cartQuantity = calculateCartQuantity();

    // display the cart quantity
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

updateCartQuantity();

/* The code iterates through all the elements with the class "js-add-to-cart-button" and
attaches click event listeners to each button. When a button is clicked, the code retrieves the
product id from the button's "data-product-id" attribute. It then gets the value of the quantity
selector element associated with the clicked button and converts it to a number. */
document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;

        // get the quantity selector element value and convert it to a number
        const quantitySelectorValue = Number(
            document.querySelector(`.js-quantity-selector-${productId}`).value
        );

        addToCart(productId, quantitySelectorValue);
        setAddedMessage(productId);
        updateCartQuantity();

        // reset the quantity selector value
        document.querySelector(`.js-quantity-selector-${productId}`).value = 1;
    });
});

// object to store added message timeouts in the `setAddedMessage` function
const addedMessageTimeouts = {};

/**
 * The function sets an added message for a specific product by adding a class to make it visible
 * and removing the class after a certain timeout period.
 * @param productId - The `productId` parameter is the unique identifier of a product. It is used to
 * select the specific added message element associated with that product.
 */
function setAddedMessage(productId) {
    // get the added message element
    let addedMessageElement = document.querySelector(
        `.js-added-to-cart-${productId}`
    );

    // add a class to the added message element to make it visible
    addedMessageElement.classList.add('added-to-cart-visible');

    // check for any previous timeouts for an added message
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

    // add the added message timeout id to the addedMessageTimeouts object
    addedMessageTimeouts[productId] = timeoutId;
}
