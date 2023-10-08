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
    calculateSavedCartItemsQuantity,
    savedCartItems
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

                    <div class="cart-item-details-container">
                        <div>
                            <div class="product-name">
                                ${matchingProduct.name}
                            </div>
                            <div class="product-price">
                                $${formatCurrency(
                                    cartItem.priceInCents * cartItem.quantity
                                )}
                            </div>
                            <div class="product-quantity-container">
                                <span>
                                    Quantity: <span class="cart-item-quantity-label">${
                                        cartItem.quantity
                                    }</span>
                                </span>
                                <span class="update-cart-item-quantity-button link-primary js-update-cart-item-quantity-button link-primary"
                                    data-product-id="${matchingProduct.id}">
                                    Update
                                </span>
                                <input class="update-cart-item-quantity-input">
                                <span class="save-new-cart-item-quantity-button link-primary">Save</span>
                                <span class="delete-cart-item-button js-delete-cart-item-button
                                link-primary" data-product-id="${
                                    matchingProduct.id
                                }">
                                    Delete
                                </span>
                                <p class="js-update-cart-item-quantity-limit-message"></p>
                            </div>
                        </div>
                        <div>
                            <span class="save-cart-item-button link-primary" data-product-id="${
                                matchingProduct.id
                            }">
                                Save for later
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

    // display the cart items
    document.querySelector('.cart-items-container').innerHTML = cartItemHTML;
}

// This function generates the HTML for when the cart is empty
function generateEmptyCartHTML() {
    document.querySelector('.cart-items-container').innerHTML = `
        <div class="empty-cart-container">
            <div class="empty-cart-message-container">
                <div>
                    <span>Looks like it's empty!</span><br><br>
                    Why not add something?
                </div>
                <div>
                    Continue shopping on the
                    <a class="link-primary" href="index.html">homepage</a>.
                </div>
            </div>
            <img class="empty-cart-container-img" src="images/icons/empty-cart.png">
        </div>
    `;
}

// This function generates the HTML for when the saved cart items section is empty
function generateEmptySavedCartItemsHTML() {
    document.querySelector('.saved-cart-items-container').innerHTML = `
        <div class="empty-saved-cart-items-container">
            <div class="empty-saved-cart-items-message-container">
                <div>
                    <span>Looks like it's empty!</span><br><br>
                    Why not add something?
                </div>
            </div>
            <img class="empty-saved-cart-items-container-img" src="images/icons/save.png">
        </div>
    `;
}

// This function updates the cart items visibility based on the cart quantity
function updateCartItemVisibility() {
    if (calculateCartQuantity() > 0) {
        generateCartHTML();
    } else {
        generateEmptyCartHTML();
    }
}

updateCartItemVisibility();

// This function updates the saved cart items visibility based on the section quantity
function updateSavedCartItemsVisibility() {
    if (calculateSavedCartItemsQuantity() > 0) {
        generateSavedCartItemsHTML();
    } else {
        generateEmptySavedCartItemsHTML();
    }
}

updateSavedCartItemsVisibility();

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
 * the cart item total, shipping cost, cart total before tax, total tax,
 * and cart total after tax.
 */
function updateOrderSummaryDisplay() {
    // calculate cart item total cost in cents
    let cartItemTotalCostInCents = calculateCartItemTotalCost();

    // determine shipping fee based on whether the cart is empty or not:
    // if the cart is empty, set the fee to 0; otherwise, set it to 499 cents.
    let shippingHandlingFeeInCents = cartItemTotalCostInCents === 0 ? 0 : 499;

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
        '.js-update-cart-item-quantity-limit-message'
    );

    // display the error message
    quantityLimitMessageElement.innerHTML = '<br>Quantity limit reached (50)';

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
 * @param productId - The unique identifier of the product.
 * @param cartItemContainer - The container element that holds the cart item.
 * It is used to access and manipulate the elements within the cart item,
 * such as the quantity input field and the quantity label.
 */
function saveNewCartItemQuantity(productId, cartItemContainer) {
    // get the quantity input field value
    const newCartItemQuantityInput = cartItemContainer.querySelector(
        '.update-cart-item-quantity-input'
    );
    const newCartItemQuantity = parseInt(
        newCartItemQuantityInput.value.trim(),
        10
    );

    if (isNaN(newCartItemQuantity)) {
        return;
    }

    if (newCartItemQuantity === '') {
        return;
    }

    if (newCartItemQuantity > 50) {
        // display an error message
        displayCartItemQuantityError(cartItemContainer);
    } else if (newCartItemQuantity === 0) {
        // remove the cart item
        removeCartItem(productId);
        updateCartItemVisibility();
        updateCartQuantityDisplay();
    } else {
        // update the cart item quantity on the page as a string
        cartItemContainer.querySelector(
            '.cart-item-quantity-label'
        ).textContent = String(newCartItemQuantity);

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
    newCartItemQuantityInput.blur();
}

/**
 * This function deletes a cart item from the display and updates elements related to the cart.
 * @param productId - The unique identifier of the cart item to be deleted from the display.
 */
function deleteCartItemDisplay(productId) {
    removeCartItem(productId);

    const cartItemContainer = document.querySelector(
        `.js-cart-item-container-${productId}`
    );

    if (cartItemContainer) {
        cartItemContainer.remove();
    }

    updateCartItemVisibility();
    updatePlaceOrderButtonVisibility();
    updateCartQuantityDisplay();
    updateOrderSummaryDisplay();
}

/**
 * This code attaches a click event listener to the container that holds all "Delete Cart Item"
 * buttons. It uses event delegation to handle the click events for the buttons. If a button is clicked,
 * the code retrieves the button `productId`, removes the cart item from the page, and updates the
 * cart quantity and order summary displays.
 * */
document
    .querySelector('.cart-items-container')
    .addEventListener('click', (event) => {
        setTimeout(() => {
            if (event.target.classList.contains('js-delete-cart-item-button')) {
                const productId = event.target.dataset.productId;
                deleteCartItemDisplay(productId);
            }
        }, 500);
    });

/**
 * This code attaches a click event listener to the container that holds all "Update Cart Item Quantity"
 * buttons. It uses event delegation to handle the click events for the buttons. If a button is clicked,
 * the code retrieves the button `productId` and corresponding cart item container. It then adds a class
 * to the container to reveal an input field and save button.
 * */
document
    .querySelector('.cart-items-container')
    .addEventListener('click', (event) => {
        if (
            event.target.classList.contains(
                'js-update-cart-item-quantity-button'
            )
        ) {
            const productId = event.target.dataset.productId;
            const cartItemContainer = document.querySelector(
                `.js-cart-item-container-${productId}`
            );

            cartItemContainer.classList.add('is-editing-quantity');
            const saveButton = cartItemContainer.querySelector(
                '.save-new-cart-item-quantity-button'
            );

            saveButton.addEventListener('click', () => {
                saveNewCartItemQuantity(productId, cartItemContainer);
            });

            // check if the 'Enter' key is pressed
            cartItemContainer
                .querySelector('.update-cart-item-quantity-input')
                .addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        saveNewCartItemQuantity(productId, cartItemContainer);
                    }
                });

            cartItemContainer
                .querySelector('.update-cart-item-quantity-input')
                .addEventListener('blur', () => {
                    saveNewCartItemQuantity(productId, cartItemContainer);
                });
        }
    });

// This function handles the "Place Order" button functionality
function placeOrder() {
    // generate a unique order ID
    const orderId = generateOrderId();

    // get the current cart items
    const cartItems = [...cart];

    // create a date class object
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
    clearCart();
    saveToLocalStorage();

    // set a flag in localStorage to indicate successful order placement
    localStorage.setItem('orderPlaced', 'true');
}

// attach a click event listener to the "Place Order" button
document.querySelector('.place-order-button').addEventListener('click', () => {
    setTimeout(() => {
        placeOrder();
        window.location.href = 'orders.html';
    }, 1000);
});

// This function updates the "Place Order" button visibility based on the cart quantity
function updatePlaceOrderButtonVisibility() {
    if (calculateCartQuantity() === 0) {
        document.querySelector('.place-order-button').style.display = 'none';
    }
}

updatePlaceOrderButtonVisibility();

/**
 * This function saves a cart item for later by adding it to the savedCartItems array.
 * @param productId - The unique identifier of the product to be saved for later in the cart.
 */
function saveCartItemForLater(productId) {
    savedCartItems.push({
        productId
    })
}

/**
 * This code attaches a click event listener to the container that holds all 
 * "Save Cart Item For Later" buttons. It uses event delegation to handle the click events 
 * for the buttons. If a button is clicked, the code retrieves the button `productId`. 
 * It then saves the cart item and updates the cart display.
 * */
document
    .querySelector('.cart-items-container')
    .addEventListener('click', (event) => {
        if (
            event.target.classList.contains(
                'save-cart-item-button'
            )
        ) {
            const productId = event.target.dataset.productId;
            
            saveCartItemForLater(productId);
            deleteCartItemDisplay(productId);
        }
    });
