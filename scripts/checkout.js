import { cart, removeFromCart} from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';


// variable to store the generated html for each cart item
let cartSummaryHTML = '';


// iterate through the cart
cart.forEach((cartItem) => {
    // variable to store the product id of the current cart item
    const productId = cartItem.productId;


    // variable to store a matching product
    let matchingProduct;


    // determine if the current cart item is in the array of products
    // if so, store the product
    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });


    // store the generated html for a product
    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
        </div>


        <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}">


            <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    $${(formatCurrency(matchingProduct.priceCents))}
                </div>
                <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-quantity-link link-primary"
                        data-product-id="${matchingProduct.id}">
                        Update
                    </span>
                    <input class="quantity-input">
                    <span class="save-quantity-link link-primary">Save</span>
                    <span class="delete-quantity-link js-delete-quantity-link 
                    link-primary" data-product-id="${matchingProduct.id}">
                        Delete
                    </span>
                </div>
            </div>


            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                <div class="delivery-option">
                    <input type="radio" checked class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            Tuesday, June 21
                        </div>
                        <div class="delivery-option-price">
                            FREE Shipping
                        </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio" class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            Wednesday, June 15
                        </div>
                        <div class="delivery-option-price">
                            $4.99 - Shipping
                        </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio" class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            Monday, June 13
                        </div>
                        <div class="delivery-option-price">
                            $9.99 - Shipping
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
});


// add generated html to the checkout page
document.querySelector('.order-summary').innerHTML = cartSummaryHTML;

// iterate through the delete quantity buttons
document.querySelectorAll('.js-delete-quantity-link').forEach((button) => {
    // attach a click event listener to the delete button link
    button.addEventListener('click', () => {
        // get the product id value
        const productId = button.dataset.productId;

        removeFromCart(productId);

        // get the item specific container
        const container = document.querySelector(
            `.js-cart-item-container-${productId}`
        );

        // remove the removed product from the page
        container.remove();
        updateCartQuantity();
    });
});