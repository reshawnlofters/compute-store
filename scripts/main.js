import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { addToCart, calculateCartQuantity } from "../data/cart.js";

// create variable to store the generated html for the products
let productsHTML = '';

// iterate through the products
products.forEach((product) => {
    // store the generated html
    productsHTML += `
    <div class="product-container">
        <div class="product-image-container">
            <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name">
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
            $${(formatCurrency(product.priceCents))}
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

// display the generated html
document.querySelector('.js-products-grid').innerHTML = productsHTML;

// iterate through the add to cart buttons
document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
    // attach a click event listener to the add to cart button
    button.addEventListener('click', () => {
        // store the product id from the attached data attribute
        const productId = button.dataset.productId;

        // add the product to the cart
        addToCart(productId);

        // set the added to cart message
        setAddedMessage(productId);

        // update the cart quantity in the cart quantity element 
        document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();

        
    });
});

// object to store the added message timeouts in setAddedMessage()
const addedMessageTimeouts = {};

// function to set the added message
function setAddedMessage(productId) {
    // get the added message element
    let addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

    // add a class to the added message element to make it visible
    addedMessage.classList.add('added-to-cart-visible');

    // check for any previous timeouts for an added message
    const previousTimeoutId = addedMessageTimeouts[productId];
    
    // clear any previous timeouts
    if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
    }

    // set an added message timeout
    const timeoutId = setInterval(() => {
        // remove the class added to the added message element to make it invisible
        addedMessage.classList.remove('added-to-cart-visible');
    }, 2000);

    // add the added message timeout id to the addedMessageTimeouts object
    addedMessageTimeouts[productId] = timeoutId;
}