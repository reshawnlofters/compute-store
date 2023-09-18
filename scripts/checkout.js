import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { orders, saveToStorage} from '../data/orders.js';
import {
    cart,
    removeFromCart,
    calculateCartQuantity,
    updateCartItemQuantity,
    updateCartItemPriceDisplay,
    calculateCartItemTotalCost,
} from '../data/cart.js';

/* The code is generating HTML for each item in the cart. It iterates through the `cart` array
and for each item, it finds the matching product in the `products` array based on the `productId`.
It then generates HTML markup using the properties of the matching product and the cart item. The
generated HTML includes details such as the delivery date, product image, name, price, quantity,
delivery options, and buttons for updating and deleting the quantity. The generated HTML is stored
in the `cartItemHTML` variable. */
let cartItemHTML = '';

cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingCartItem;

    /* The code iterates through the `products` array and checks if each product's `id` matches
    the `productId` of the current cart item being iterated over. If there is a match, it assigns
    the matching product to the `matchingCartItem` variable. This is done to access the properties
    of the matching product when generating the HTML for each cart item. */
    products.forEach((product) => {
        if (product.id === productId) {
            matchingCartItem = product;
        }
    });

    cartItemHTML += `
    <div class="cart-item-container js-cart-item-container-${
        matchingCartItem.id
    }">
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
                <p class="js-quantity-limit-message"></p>
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

// display the cart items on the page
document.querySelector('.order-summary').innerHTML = cartItemHTML;

// The function updates the quantity display of items in the cart
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
 * The function updates the order summary displayed on the page by calculating
 * and displaying the cart item total cost, shipping cost, cart total before tax,
 * cart total tax, and cart total cost after tax.
 */
function updateOrderSummaryDisplay() {
    // calculate cart item total cost in cents
    let cartItemTotalCostInCents = calculateCartItemTotalCost();

    // determine shipping and handling fee in cents based on whether the cart is empty or not:
    // If the cart is empty, set the fee to 0; otherwise, set it to 999 cents.
    let shippingHandlingFeeInCents = cartItemTotalCostInCents === 0 ? 0 : 999;

    // calculate cart total before tax in cents
    let cartTotalBeforeTaxInCents =
        cartItemTotalCostInCents + shippingHandlingFeeInCents;

    // update cart item total cost
    document.querySelector(
        '.js-payment-summary-items-cost'
    ).innerHTML = `$${formatCurrency(cartItemTotalCostInCents)}`;

    // update shipping cost
    document.querySelector(
        '.js-payment-summary-shipping-cost'
    ).innerHTML = `$${formatCurrency(shippingHandlingFeeInCents)}`;

    // update cart total before tax
    document.querySelector(
        '.js-payment-summary-total-before-tax-cost'
    ).innerHTML = `$${formatCurrency(cartTotalBeforeTaxInCents)}`;

    // update cart total tax (13%)
    document.querySelector(
        '.js-payment-summary-tax-cost'
    ).innerHTML = `$${formatCurrency(cartTotalBeforeTaxInCents * 0.13)}`;

    // update cart total cost after tax
    document.querySelector(
        '.js-payment-summary-total-cost'
    ).innerHTML = `$${formatCurrency(cartTotalBeforeTaxInCents * 1.13)}`;
}

updateOrderSummaryDisplay();

/**
 * The function displays a quantity limit message for a specific cart
 * item container and removes it after 4 seconds.
 * @param cartItemContainer - The cartItemContainer parameter is the container element that holds the
 * cart item. It is used to find the quantity limit message element within the container and display an
 * error message when the quantity limit is reached.
 */
function displayCartItemQuantityError(cartItemContainer) {
    // get the quantity limit message element for the specific cart item container
    const quantityLimitMessageElement = cartItemContainer.querySelector(
        '.js-quantity-limit-message'
    );

    // add the message
    quantityLimitMessageElement.innerHTML = 'Quantity limit reached (50)';

    // clear any previous timeouts
    if (cartItemContainer.timeoutId) {
        clearTimeout(cartItemContainer.timeoutId);
    }

    // set a timeout for the message and store the timeout id in the container
    cartItemContainer.timeoutId = setTimeout(() => {
        // remove the message
        quantityLimitMessageElement.innerHTML = '';
    }, 4000);
}

/**
 * The function saves the new quantity of a cart item and updates the cart and order summary displays.
 * @param productId - The ID of the product that the cart item corresponds to.
 * @param cartItemContainer - The `cartItemContainer` parameter is a reference to the container element
 * that holds the cart item. It is used to access and manipulate the elements within the cart item,
 * such as the quantity input field and the quantity label.
 */
function saveNewCartItemQuantity(productId, cartItemContainer) {
    // get the quantity input field value and convert it to a number
    const newCartItemQuantity = Number(
        cartItemContainer.querySelector('.quantity-input').value
    );

    if (newCartItemQuantity > 50) {
        // display error message
        displayCartItemQuantityError(cartItemContainer);
        return;
    }

    if (newCartItemQuantity === 0) {
        // remove the cart item
        removeFromCart(productId);
        cartItemContainer.remove();
    } else {
        // update the cart item quantity on the page
        cartItemContainer.querySelector('.quantity-label').innerHTML =
            newCartItemQuantity;

        // remove the class added to the cart item container
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

/* The code adds click event listeners to each "delete cart item" button on the page.
When a button is clicked, the code retrieves the product id associated with the button,
removes the cart item from the page, and updates the cart quantity and order summary display. */
document.querySelectorAll('.js-delete-quantity-link').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;

        removeFromCart(productId);

        // remove the cart item from the page and update displays
        const cartItemContainer = document.querySelector(
            `.js-cart-item-container-${productId}`
        );

        cartItemContainer.remove();
        updateCartQuantityDisplay();
        updateOrderSummaryDisplay();
    });
});

/* The code adds click event listeners to each "update cart item quantity" button on the page.
When a button is clicked, the code retrieves the product id and the corresponding cart item
container. It then adds a class to the container to reveal an input field and a save button. */
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

// This function handles the "Place Order" button click
function placeOrder() {
    // get the current cart items
    const cartItems = [...cart];

    // add the cart items to the orders array
    orders.push({
        items: cartItems,
        // add other order-related information if needed
    });

    // clear the cart
    clearCart();

    // save the updated orders array to local storage
    saveToStorage();
}

// attach a click event listener to the "Place Order" button
document
    .querySelector('.place-order-button')
    .addEventListener('click', placeOrder);

// This function clears all cart items
function clearCart() {
    cart.forEach((cartItem) => {
        removeFromCart(cartItem.productId);
    });
}
