import { products } from '../data/products.js';
import { formatCurrency } from './utils/format-currency.js';
import { orders, saveToLocalStorage } from '../data/orders.js';
import { generateOrderId, calculateOrderArrivalDate } from './orders-page.js';
import {
    cart,
    removeCartItem,
    calculateCartQuantity,
    updateCartItemQuantity,
    updateCartItemPriceDisplay,
    calculateCartItemTotalCost,
    clearCart,
} from '../data/cart.js';

/* This function generates the HTML for each cart item in the `cart` array. It iterates 
through each cart item and finds the matching product in the `products` array based on the `productId`.
It then generates HTML markup using the details of the matching product and the cart item.
The generated HTML is stored in the `cartItemHTML` variable. */
function generateCartHTML() {
    let cartItemHTML = '';

    cart.forEach((cartItem) => {
        // find and assign the matching product to access product details
        const productId = cartItem.productId;
        let matchingProduct;

        products.forEach((product) => {
            if (product.id === productId) {
                matchingProduct = product;
            }
        });

        cartItemHTML += `
            <div class="cart-item-container js-cart-item-container-${
                matchingProduct.id
            }">
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
                            $${formatCurrency(
                                cartItem.priceInCents * cartItem.quantity
                            )}
                        </div>
                        <div class="product-quantity">
                            <span>
                                Quantity: <span class="quantity-label">${
                                    cartItem.quantity
                                }</span>
                            </span>
                            <span class="update-quantity-link link-primary js-update-quantity-link link-primary"
                                data-product-id="${matchingProduct.id}">
                                Update
                            </span>
                            <input class="quantity-input">
                            <span class="save-quantity-link link-primary">Save</span>
                            <span class="delete-quantity-link js-delete-quantity-link 
                            link-primary" data-product-id="${
                                matchingProduct.id
                            }">
                                Delete
                            </span>
                        </div>
                        <p class="js-quantity-limit-message"></p>
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

    // display the cart items on the page
    document.querySelector('.order-summary').innerHTML = cartItemHTML;
}

generateCartHTML();

// This function updates the cart quantity displayed on the page
function updateCartQuantityDisplay() {
    document.querySelector(
        '.js-return-to-home-link'
    ).innerHTML = `${calculateCartQuantity()} items`;

    document.querySelector(
        '.js-payment-summary-items'
    ).innerHTML = `${calculateCartQuantity()}`;
}

updateCartQuantityDisplay();

/**
 * This function updates the order summary displayed on the page by calculating
 * and displaying the cart item total, shipping cost, cart total before tax,
 * total tax, and cart total after tax.
 */
function updateOrderSummaryDisplay() {
    // calculate cart item total cost in cents
    let cartItemTotalCostInCents = calculateCartItemTotalCost();

    // determine shipping fee based on whether the cart is empty or not:
    // if the cart is empty, set the fee to 0; otherwise, set it to 999 cents.
    let shippingHandlingFeeInCents = cartItemTotalCostInCents === 0 ? 0 : 999;

    // calculate cart total before tax
    let cartTotalBeforeTaxInCents =
        cartItemTotalCostInCents + shippingHandlingFeeInCents;

    // display cart item total
    document.querySelector(
        '.js-payment-summary-items-cost'
    ).innerHTML = `$${formatCurrency(cartItemTotalCostInCents)}`;

    // display shipping cost
    document.querySelector(
        '.js-payment-summary-shipping-cost'
    ).innerHTML = `$${formatCurrency(shippingHandlingFeeInCents)}`;

    // display cart total before tax
    document.querySelector(
        '.js-payment-summary-total-before-tax-cost'
    ).innerHTML = `$${formatCurrency(cartTotalBeforeTaxInCents)}`;

    // display total tax (13%)
    document.querySelector(
        '.js-payment-summary-tax-cost'
    ).innerHTML = `$${formatCurrency(cartTotalBeforeTaxInCents * 0.13)}`;

    // display cart total after tax
    document.querySelector(
        '.js-payment-summary-total-cost'
    ).innerHTML = `$${formatCurrency(cartTotalBeforeTaxInCents * 1.13)}`;
}

updateOrderSummaryDisplay();

/**
 * This function temporarily displays a cart item quantity limit message.
 * @param cartItemContainer - The container element that holds the cart item.
 * It is used to find the quantity limit message element within the container.
 */
function displayCartItemQuantityError(cartItemContainer) {
    // get the quantity limit message element for the specific cart item container
    const quantityLimitMessageElement = cartItemContainer.querySelector(
        '.js-quantity-limit-message'
    );

    // display the error message
    quantityLimitMessageElement.innerHTML = 'Quantity limit reached (50)';

    // clear any previous timeouts
    if (cartItemContainer.timeoutId) {
        clearTimeout(cartItemContainer.timeoutId);
    }

    // set a timeout for the message and store the `timeoutId` in the container
    cartItemContainer.timeoutId = setTimeout(() => {
        // remove the error message
        quantityLimitMessageElement.innerHTML = '';
    }, 4000);
}

/**
 * This function saves a new cart item quantity and updates the cart and order summary displays.
 * @param productId - The the unique identifier of the product.
 * @param cartItemContainer - The container element that holds the cart item. 
 * It is used to access and manipulate the elements within the cart item,
 * such as the quantity input field and the quantity label.
 */
function saveNewCartItemQuantity(productId, cartItemContainer) {
    // get the quantity input field value and convert it to a number
    const newCartItemQuantity = Number(
        cartItemContainer.querySelector('.quantity-input').value
    );

    if (newCartItemQuantity > 50) {
        // display the error message
        displayCartItemQuantityError(cartItemContainer);
        return;
    }

    if (newCartItemQuantity === 0) {
        // remove the cart item
        removeCartItem(productId);
        cartItemContainer.remove();
    } else {
        // update the cart item quantity on the page
        cartItemContainer.querySelector('.quantity-label').innerHTML =
            newCartItemQuantity;

        // remove the class added to the cart item container for editing
        cartItemContainer.classList.remove('is-editing-quantity');

        updateCartItemQuantity(productId, newCartItemQuantity);
        updateCartItemPriceDisplay(
            productId,
            cartItemContainer,
            newCartItemQuantity
        );
        updateCartQuantityDisplay();
        updateOrderSummaryDisplay();
    }

    // remove focus from the quantity input field after saving the new quantity
    cartItemContainer.querySelector('.quantity-input').blur();
}

/* This code adds click event listeners to each "Delete Cart Item" button on the page.
When a button is clicked, the code retrieves the button `productId`, removes the cart item 
from the page, and updates the cart quantity and order summary displayed. */
document.querySelectorAll('.js-delete-quantity-link').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;

        removeCartItem(productId);

        // remove the cart item from the page and update displays
        const cartItemContainer = document.querySelector(
            `.js-cart-item-container-${productId}`
        );

        cartItemContainer.remove();
        updatePlaceOrderButtonVisibility();
        updateCartQuantityDisplay();
        updateOrderSummaryDisplay();
    });
});

/* This code adds click event listeners to each "Update Cart Item Quantity" button on the page.
When a button is clicked, the code retrieves the `productId` and corresponding cart item
container. It then adds a class to the container to reveal an input field and save button. */
document.querySelectorAll('.js-update-quantity-link').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const cartItemContainer = document.querySelector(
            `.js-cart-item-container-${productId}`
        );

        cartItemContainer.classList.add('is-editing-quantity');
        const saveButton = cartItemContainer.querySelector(
            '.save-quantity-link'
        );

        saveButton.addEventListener('click', () => {
            saveNewCartItemQuantity(productId, cartItemContainer);
        });

        // check if the 'Enter' key is pressed
        cartItemContainer
            .querySelector('.quantity-input')
            .addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    saveNewCartItemQuantity(productId, cartItemContainer);
                }
            });

        cartItemContainer
            .querySelector('.quantity-input')
            .addEventListener('blur', () => {
                saveNewCartItemQuantity(productId, cartItemContainer);
            });
    });
});

// This function handles the "Place Order" button operation
function placeOrder() {
    // generate a unique order ID
    const orderId = generateOrderId();

    // get the current cart items
    const cartItems = [...cart];

    // create date class object
    let date = new Date();

    // create an array of month names for mapping
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    // add the order details to the orders array
    orders.push({
        id: orderId,
        items: cartItems,
        priceInCents: (calculateCartItemTotalCost() + 999) * 1.13,
        orderDate: `${monthNames[date.getMonth()]} ${date.getDate()}`,
        arrivalDate: `${calculateOrderArrivalDate(date, monthNames)}`,
    });

    clearCart();
    saveToLocalStorage();
}

// attach a click event listener to the "Place Order" button on the page
document
    .querySelector('.place-order-button')
    .addEventListener('click', placeOrder);

// This function updates the "Place Order" button visibility based on the cart quantity.
function updatePlaceOrderButtonVisibility() {
    const placeOrderButton = document.querySelector('.place-order-button');

    if (calculateCartQuantity() === 0) {
        placeOrderButton.style.display = 'none';
    } else {
        placeOrderButton.style.display = 'block';
    }
}

// initially hide the "Place Order" button
updatePlaceOrderButtonVisibility();
