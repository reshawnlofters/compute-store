import {findProductById, formatCurrency, date, monthNames} from '../../shared/utils.js';
import {updateWishListVisibility} from '../wish-list-page/wish-list.js';
import {updateOrderSummaryDisplay, updatePlaceOrderButtonVisibility} from './order-summary.js';
import {
    calculateQuantityOfCartItems,
    cart,
    removeCartItem,
    updateCartItemPriceDisplay,
    updateCartItemQuantity,
    updateWishListInLocalStorage,
    wishList,
} from '../../../data/checkout-page.js';

const cartItemContainer = document.querySelector('.cart-items-container');

function generateCartHTML() {
    let cartHTML = '';

    cart.forEach((cartItem) => {
        const matchingProduct = findProductById(cartItem.productId);

        if (matchingProduct) {
            cartHTML += `
                <div class="cart-item-container cart-item-container-${matchingProduct.id} product-container">
                    <div class="cart-item-details-grid">
                        <div class="product-image-container">
                            <img class="product-image" src="${matchingProduct.image}" alt="product image">
                        </div>
                        
                        <div class="cart-item-details-container">
                            <div>
                                <div class="product-name">
                                    ${matchingProduct.name}
                                </div>
                                <div class="product-price">
                                    ${formatCurrency(cartItem.priceInCents * cartItem.quantity)}
                                </div>
                                <div class="cart-item-quantity-container">
                                    <div class="cart-item-quantity-display">
                                        Quantity: <span class="cart-item-quantity-count">${
                cartItem.quantity
            }</span>
                                    </div>
                                    <div class="update-cart-item-quantity-container">
                                        <span class="update-cart-item-quantity-button update-cart-item-quantity-button link-primary"
                                        data-product-id="${matchingProduct.id}">
                                            Update
                                        </span>
                                        <input class="update-cart-item-quantity-input" type="number"  autocomplete="new-quantity">
                                        <span class="save-new-cart-item-quantity-button link-primary">Save</span>
                                    </div>
                                </div>
                                <p class="cart-item-quantity-limit-message"></p>
                            </div>
                            <div>
                                <span class="add-product-to-wish-list-button link-primary" data-product-id="${
                matchingProduct.id
            }">
                                    Add to Wish List
                                </span>
                                <span class="remove-cart-item-button
                                    link-primary" data-product-id="${matchingProduct.id}">
                                        Remove
                                </span>
                            </div>
                        </div>
    
                        <div class="delivery-options">
                            <div class="delivery-options-title">
                                Delivery option:
                            </div>
                            <div class="delivery-option">
                                <input type="radio" checked class="delivery-option-input"
                                    name="delivery-option-${matchingProduct.id}">
                                <div class="delivery-date-option label-primary"></div>
                            </div>
                            <div class="delivery-option">
                                <input type="radio" class="delivery-option-input"
                                    name="delivery-option-${matchingProduct.id}">
                                <div class="delivery-date-option label-primary"></div>
                            </div>
                            <div class="delivery-option">
                                <input type="radio" class="delivery-option-input"
                                    name="delivery-option-${matchingProduct.id}">
                                <div class="delivery-date-option label-primary"></div>
                            </div>
                        </div>
                    </div>
                </div>`;
        } else {
            console.error('Matching product not found.');
        }
    });

    if (cartItemContainer) {
        cartItemContainer.innerHTML = cartHTML;
    }
}

function generateEmptyCartHTML() {
    if (cartItemContainer) {
        cartItemContainer.innerHTML = `
            <div class="empty-cart-item-container">
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
                <i class="bi bi-cart-x" id="emptyCartContainerImg"></i>
            </div>
        `;
    }
}

/**
 * Updates the visibility of the cart based on the quantity of cart items.
 * - If the cart is not empty, HTML for the cart items is generated.
 * - If the cart is empty, HTML for an empty cart is generated.
 */
export function updateCartVisibility() {
    const cartItemsQuantity = calculateQuantityOfCartItems();
    cartItemsQuantity > 0 ? generateCartHTML() : generateEmptyCartHTML();
}

updateCartVisibility();

/**
 * Updates the quantity of cart items displayed in the checkout page header.
 */
export function updateCartItemsQuantityDisplay() {
    const cartItemsQuantity = calculateQuantityOfCartItems();
    const cartItemsQuantityElement = document.querySelector('.cart-items-quantity');

    if (cartItemsQuantityElement) {
        cartItemsQuantityElement.textContent =
            cartItemsQuantity === 1 ? `${cartItemsQuantity} Item` : `${cartItemsQuantity} Items`;
    } else {
        console.error('Cart items quantity element not found.')
    }
}

updateCartItemsQuantityDisplay();

/**
 * Displays a cart item quantity limit message temporarily when the limit is exceeded.
 * @param {Element} cartItemContainer - The container element of the cart item.
 */
function displayCartItemQuantityLimitMessage(cartItemContainer) {
    const messageElement = cartItemContainer.querySelector('.cart-item-quantity-limit-message');

    if (messageElement) {
        messageElement.innerHTML = 'Quantity limit: 50';
    } else {
        console.error('Message element not found in cart item container.')
        return;
    }

    // Clear any existing timeouts to prevent multiple messages being displayed
    if (cartItemContainer.timeoutId) {
        clearTimeout(cartItemContainer.timeoutId);
    }

    // Set a timeout to clear the message after a duration
    cartItemContainer.timeoutId = setTimeout(() => {
        messageElement.innerHTML = '';
    }, 3000);
}

/**
 * Saves the quantity of a cart item based on user input and updates UI displays.
 * @param {string} productId - The unique identifier of the cart item.
 * @param {Element} cartItemContainer - The container element of the cart item.
 */
function saveNewCartItemQuantity(productId, cartItemContainer) {
    const updateCartItemQuantityElement = cartItemContainer.querySelector(
        '.update-cart-item-quantity-input'
    );
    const newQuantity = parseInt(updateCartItemQuantityElement.value.trim(), 10);

    if (Number.isNaN(newQuantity)) {
        return;
    } else if (newQuantity === 0) {
        handleZeroCartItemQuantityInput(productId);
    } else if (newQuantity > 50) {
        handleInvalidCartItemQuantityInput(cartItemContainer);
    } else {
        handleValidCartItemQuantityInput(productId, cartItemContainer, newQuantity);
    }

    updateCartItemQuantityElement.blur();
}

/**
 * Handles a cart item quantity input of zero.
 * @param {string} productId - The unique identifier of the cart item.
 */
function handleZeroCartItemQuantityInput(productId) {
    removeCartItem(productId);
    updateCartVisibility();
    updateCartItemsQuantityDisplay();
    updateOrderSummaryDisplay();
}

/**
 * Handles a cart item quantity input that exceeds the limit.
 * @param {Element} cartItemContainer - The container element of the cart item.
 */
function handleInvalidCartItemQuantityInput(cartItemContainer) {
    displayCartItemQuantityLimitMessage(cartItemContainer);
}

/**
 * Handles a valid cart item quantity input.
 * @param {string} productId - The unique identifier of the cart item.
 * @param {Element} cartItemContainer - The container element of the cart item.
 * @param {number} newQuantity - The new cart item quantity inputted by the user.
 */
function handleValidCartItemQuantityInput(productId, cartItemContainer, newQuantity) {
    // Update the cart item quantity label
    if (cartItemContainer) {
        cartItemContainer.querySelector('.cart-item-quantity-count').innerHTML = String(newQuantity);
    } else {
        console.log('Cart item container not found.');
        return;
    }

    // Remove the 'editing-cart-item-quantity' class from the container
    cartItemContainer.classList.remove('editing-cart-item-quantity');

    updateCartItemQuantity(productId, newQuantity);
    updateCartItemPriceDisplay(productId, cartItemContainer, newQuantity);
    updateCartItemsQuantityDisplay();
    updateOrderSummaryDisplay();
}

/**
 * Removes a cart item from the UI display.
 * @param {string} productId - The unique identifier of the cart item.
 */
function removeCartItemDisplay(productId) {
    const cartItemContainer = document.querySelector(`.cart-item-container-${productId}`);

    if (cartItemContainer) {
        // Remove the cart item container from the cart
        cartItemContainer.remove();

        updateCartVisibility();
        updatePlaceOrderButtonVisibility();
        updateOrderSummaryDisplay();
        updateCartItemsQuantityDisplay();
    } else {
        console.error('Cart item container not found.');
    }
}

/**
 * Updates cart item delivery date options displayed based on the current date.
 * Delivery dates options are up to 3 days after the current date.
 */
export function updateCartItemDeliveryDateOptions() {
    document.querySelectorAll('.delivery-date-option').forEach((dateElement, index) => {
        const currentDate = new Date();
        const daysToAdd = (index % 3) + 1;

        dateElement.textContent = formatDeliveryDate(currentDate, daysToAdd);
    });
}

updateCartItemDeliveryDateOptions();

/**
 * Formats delivery dates.
 * @param {Date} currentDate - The current date.
 * @param {number} daysToAdd - The number of days to add to the current date.
 * @returns {string} The formatted date string.
 */
function formatDeliveryDate(currentDate, daysToAdd) {
    const deliveryDate = new Date(currentDate);

    if (deliveryDate) {
        deliveryDate.setDate(currentDate.getDate() + daysToAdd);
    } else {
        console.error('Delivery date not found.');
        return '';
    }

    return deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Adds an event listener to each delivery date option for radio button selection.
 * When a delivery option date is clicked, the corresponding radio button is checked.
 */
export function addEventListenersToDeliveryDateOptions() {
    document.querySelectorAll('.delivery-date-option').forEach((dateElement) => {
        dateElement.addEventListener('click', () => {
            const radioInput = dateElement.parentNode.querySelector('.delivery-option-input');

            radioInput.checked = true;
        });
    });
}

addEventListenersToDeliveryDateOptions();

/**
 * Handles click events outside of cart item containers.
 * - Removes the 'editing-cart-item-quantity' class from all cart item containers for continuity.
 * @param {Event} event - The click event object.
 */
function handleClickOutsideCartItemContainer(event) {
    if (!event.target.closest('.cart-item-container')) {
        const cartItemContainers = document.querySelectorAll('.cart-item-container');

        cartItemContainers.forEach((container) => {
            container.classList.remove('editing-cart-item-quantity');
        });
    }
}

document.addEventListener('click', handleClickOutsideCartItemContainer);

/**
 * Handles the "update cart quantity" click event.
 * - If the button is clicked, the corresponding cart item container is identified.
 * - Then, classes are added to display an input field and "save" button for updating the cart item quantity.
 */
function handleUpdateQuantityButtonClick() {
    cartItemContainer.addEventListener('click', (event) => {
        const saveButton = event.target.closest('.update-cart-item-quantity-button');

        if (!saveButton) {
            return;
        }

        const productId = saveButton.dataset.productId;
        const cartItemContainer = document.querySelector(`.cart-item-container-${productId}`);

        if (!cartItemContainer) {
            console.error(`Cart item container not found for productId: ${productId}`);
            return;
        }

        cartItemContainer.classList.add('editing-cart-item-quantity');

        const saveNewQuantityButton= cartItemContainer.querySelector(
            '.save-new-cart-item-quantity-button'
        );
        const inputElement = cartItemContainer.querySelector(
            '.update-cart-item-quantity-input'
        );

        const saveHandler = () => saveNewCartItemQuantity(productId, cartItemContainer);

        saveNewQuantityButton.addEventListener('click', saveHandler);
        inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                saveHandler();
            }
        });
        inputElement.addEventListener('blur', saveHandler);
    });
}

if (cartItemContainer) {
    cartItemContainer.addEventListener('click', handleUpdateQuantityButtonClick);
}

/**
 * Handles the "remove cart item" click event.
 * - If the button is clicked, the cart item is removed from the cart and UI displays are updated.
 * @param {Event} event - The click event object.
 */
function handleRemoveCartItemButtonClick(event) {
    const removeButton = event.target.closest('.remove-cart-item-button');
    if (removeButton) {
        const productId = removeButton.dataset.productId;

        removeCartItem(productId);
        removeCartItemDisplay(productId);
        updateCartItemDeliveryDateOptions();
        addEventListenersToDeliveryDateOptions();
    }
}

if (cartItemContainer) {
    cartItemContainer.addEventListener('click', handleRemoveCartItemButtonClick);
}

/**
 * Returns true if a product is already in the wish list and false otherwise
 * @param {string} productId - The unique identifier of the product.
 * @returns {boolean}
 */
export function isProductAlreadyInWishList(productId) {
    return wishList.some((product) => product.productId === productId);
}

/**
 * Adds a product to the wish list.
 * - If a product is already in the wish list, it is not added to the wish list.
 * @param {string} productId - The unique identifier of the product.
 */
export function addProductToWishList(productId) {
    if (!isProductAlreadyInWishList(productId)) {
        // Create wish list object
        const wishListItem = {
            productId,
            date: `${monthNames[date.getMonth()]} ${date.getDate()}`
        }

        // Add wish list item to 'wish list' array
        wishList.push(wishListItem);

        updateWishListInLocalStorage();
        updateWishListVisibility();
    }
}

/**
 * Handles the "add product to wish list" click event.
 * - If the button is clicked, the product is added to the wish list and UI displays are updated.
 * @param {Event} event - The click event object.
 */
function handleAddToWishListButtonClick(event) {
    const addToWishListButton = event.target.closest('.add-product-to-wish-list-button');

    if (addToWishListButton) {
        const productId = addToWishListButton.dataset.productId;

        addProductToWishList(productId);
        removeCartItem(productId);
        removeCartItemDisplay(productId);
        updateCartItemDeliveryDateOptions();
        addEventListenersToDeliveryDateOptions();
    }
}

if (cartItemContainer) {
    cartItemContainer.addEventListener('click', handleAddToWishListButtonClick);
}
