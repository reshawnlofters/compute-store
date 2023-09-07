import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { cart, removeFromCart, calculateCartQuantity, updateCartItemQuantity,
        updateCartItemPriceDisplayed, calculateCartItemTotalCost} from '../data/cart.js';

// variable to store the generated html for each cart item
let cartHTML = '';

// iterate through the cart
cart.forEach((cartItem) => {
    // variable to store the product id of a cart item
    const productId = cartItem.productId;

    // variable to store a matching cart item
    let matchingCartItem;

    // iterate through the products
    products.forEach((product) => {
        // store the product if it is already in the cart to access object properties
        if (product.id === productId) {
            matchingCartItem = product;
        }
    });

    // store the generated html for each cart item
    cartHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingCartItem.id}">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingCartItem.image}">

            <div class="cart-item-details">
                <div class="product-name">
                    ${matchingCartItem.name}
                </div>
                <div class="product-price">
                    $${(formatCurrency(cartItem.priceCents * cartItem.quantity))}
                </div>
                <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-quantity-link link-primary"
                        data-product-id="${matchingCartItem.id}">
                        Update
                    </span>
                    <input class="quantity-input">
                    <span class="save-quantity-link link-primary">Save</span>
                    <span class="delete-quantity-link js-delete-quantity-link 
                    link-primary" data-product-id="${matchingCartItem.id}">
                        Delete
                    </span>
                </div>
                <p class="quantity-limit-message"></p>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                <div class="delivery-option">
                    <input type="radio" checked class="delivery-option-input"
                        name="delivery-option-${matchingCartItem.id}">
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
                        name="delivery-option-${matchingCartItem.id}">
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
                        name="delivery-option-${matchingCartItem.id}">
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

// add the generated html to the page
document.querySelector('.order-summary').innerHTML = cartHTML;

// function to update the cart quantity on the page
function updateCartQuantityDisplayed() {
    document.querySelector('.js-return-to-home-link')
        .innerHTML = `${calculateCartQuantity()} items`;

    document.querySelector('.js-payment-summary-items')
        .innerHTML = `${calculateCartQuantity()}`;
}

updateCartQuantityDisplayed();

// function to update the order summary displayed on the page
function updateOrderSummaryDisplay() {
    let cartItemTotalCostInCents = calculateCartItemTotalCost();
    const shippingHandlingFeeInCents = 999;
    let cartTotalBeforeTaxInCents = cartItemTotalCostInCents + shippingHandlingFeeInCents;

    // update cart item total cost
    document.querySelector('.js-payment-summary-items-cost')
        .innerHTML = `$${formatCurrency(cartItemTotalCostInCents)}`;
    
    // update shipping cost
    document.querySelector('.js-payment-summary-shipping-cost')
        .innerHTML = `$${formatCurrency(shippingHandlingFeeInCents)}`;
    
    // update cart total before tax
    document.querySelector('.js-payment-summary-total-before-tax-cost')
        .innerHTML = `$${formatCurrency(cartTotalBeforeTaxInCents)}`;

    // update cart total tax
    document.querySelector('.js-payment-summary-tax-cost')
        .innerHTML = `$${formatCurrency(cartTotalBeforeTaxInCents * 0.13)}`;
    
    // update cart total cost after tax
    document.querySelector('.js-payment-summary-total-cost')
        .innerHTML = `$${formatCurrency(cartTotalBeforeTaxInCents * 1.13)}`;
}

updateOrderSummaryDisplay();

// function to display the quantity limit message
function displayCartItemQuantityError(cartItemContainer) {
    // get the quantity limit message element for the specific cart item container
    const quantityLimitMessage = cartItemContainer.querySelector('.quantity-limit-message');

    // add the message
    quantityLimitMessage.innerHTML = 'Quantity limit reached (50)';

    // clear any previous timeouts
    if (cartItemContainer.timeoutId) {
        clearTimeout(cartItemContainer.timeoutId);
    }

    // set a timeout for the message and store the timeout id in the container
    cartItemContainer.timeoutId = setTimeout(() => {
        // remove the message
        quantityLimitMessage.innerHTML = '';
    }, 4000);
}

// function to save the new cart item quantities
function saveNewCartItemQuantity(productId, cartItemContainer) {
    // get the quantity input field value and convert it to a number
    const newCartItemQuantity = Number(cartItemContainer.querySelector('.quantity-input').value);
    
    if (newCartItemQuantity > 50) {
        // display an error message
        displayCartItemQuantityError(cartItemContainer);
        return;
    }

    if (newCartItemQuantity === 0) {
        // remove the cart item
        removeFromCart(productId);
        cartItemContainer.remove();
    } 
    
    else {
        // update the cart item quantity on the page
        cartItemContainer.querySelector('.quantity-label').innerHTML = newCartItemQuantity;

        // remove the class added to the cart item container
        cartItemContainer.classList.remove('is-editing-quantity');
        
        updateCartItemQuantity(productId, newCartItemQuantity);
        updateCartItemPriceDisplayed(productId, cartItemContainer, newCartItemQuantity);
        updateCartQuantityDisplayed();
        updateOrderSummaryDisplay();
    }

    // remove focus from the quantity input field after saving the new quantity
    cartItemContainer.querySelector('.quantity-input').blur();
}

// iterate through the cart item delete buttons
document.querySelectorAll('.js-delete-quantity-link').forEach((button) => {
    // attach a click event listener to the delete button
    button.addEventListener('click', () => {
        // get the product id
        const productId = button.dataset.productId;

        removeFromCart(productId);

        // get the cart item container
        const cartItemContainer = document.querySelector(
            `.js-cart-item-container-${productId}`
        );

        // remove the removed cart item from the page
        cartItemContainer.remove();
        updateCartQuantityDisplayed();
        updateOrderSummaryDisplay();
    });
});

// iterate through the update cart item quantity buttons
document.querySelectorAll('.js-update-quantity-link').forEach((button) => {
    // attach a click event listener to the update quantity buttons
    button.addEventListener('click', () => {
        // get the product id
        const productId = button.dataset.productId;
        
        // get the cart item container
        const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
        
        // add a class to the product container to reveal the input and save element
        cartItemContainer.classList.add('is-editing-quantity');
        
        // get the save button element
        const saveButton = cartItemContainer.querySelector('.save-quantity-link');

        // attach a click event listener to the save button
        saveButton.addEventListener('click', () => {
            saveNewCartItemQuantity(productId, cartItemContainer);
        });

        // attach a keydown event listener to the quantity input field
        cartItemContainer.querySelector('.quantity-input').addEventListener('keydown', (event) => {
            // check if the user pressed the'Enter' key
            if (event.key === 'Enter') {
                saveNewCartItemQuantity(productId, cartItemContainer);
            }
        });

        /* attach a blur event listener to the quantity input field to ensure,
           the product quantity is updated correctly when the input field loses focus */
        cartItemContainer.querySelector('.quantity-input').addEventListener('blur', () => {
            saveNewCartItemQuantity(productId, cartItemContainer);
        });
    });
});

