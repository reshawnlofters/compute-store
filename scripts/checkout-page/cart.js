import { products } from '../../data/home-page.js';
import { formatCurrency } from '../utils/format-currency.js';
import { updateWishListVisibility } from './wish-list.js';
import { updateOrderSummaryDisplay, updatePlaceOrderButtonVisibility } from './order-summary.js';
import {
    cart,
    wishList,
    calculateCartQuantity,
    updateCartItemQuantity,
    updateCartItemPriceDisplay,
    removeCartItem,
    updateWishListInLocalStorage,
} from '../../data/checkout-page.js';

const cartItemContainer = document.querySelector('.cart-items-container');

function generateCartHTML() {
    let cartHTML = '';

    cart.forEach((cartItem) => {
        const matchingProduct = products.find((product) => product.id === cartItem.productId);

        cartHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                <div class="cart-item-details-grid">
                    <img class="product-image" src="${matchingProduct.image}">

                    <div class="cart-item-details-container">
                        <div>
                            <div class="product-name">
                                ${matchingProduct.name}
                            </div>
                            <div class="product-price">
                                ${formatCurrency(cartItem.priceInCents * cartItem.quantity)}
                            </div>
                            <div class="cart-item-quantity-container">
                                <span>
                                    Quantity: <span class="cart-item-quantity-count">${
                                        cartItem.quantity
                                    }</span>
                                </span>
                                <span class="update-cart-item-quantity-button link-primary js-update-cart-item-quantity-button link-primary"
                                data-product-id="${matchingProduct.id}">
                                    Update
                                </span>
                                <input class="update-cart-item-quantity-input" type="number"  autocomplete="new-quantity">
                                <span class="save-new-cart-item-quantity-button link-primary">Save</span>
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
                            <div class="delivery-option-date"></div>
                        </div>
                        <div class="delivery-option">
                            <input type="radio" class="delivery-option-input"
                                name="delivery-option-${matchingProduct.id}">
                            <div class="delivery-option-date"></div>
                        </div>
                        <div class="delivery-option">
                            <input type="radio" class="delivery-option-input"
                                name="delivery-option-${matchingProduct.id}">
                            <div class="delivery-option-date"></div>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    cartItemContainer.innerHTML = cartHTML;
}

function generateEmptyCartHTML() {
    cartItemContainer.innerHTML = `
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

/**
 * Updates the visibility of the cart based on the quantity of items in the cart.
 * If the cart is not empty, it generates the cart HTML; otherwise, it generates
 * HTML for an empty cart.
 */
export function updateCartVisibility() {
    const cartQuantity = calculateCartQuantity();
    cartQuantity > 0 ? generateCartHTML() : generateEmptyCartHTML();
}

updateCartVisibility();

/**
 * Updates the cart quantity display in the checkout header.
 * Retrieves the cart quantity using calculateCartQuantity() and updates
 * the corresponding DOM element with the calculated value.
 */
export function updateCartQuantityDisplay() {
    const cartQuantity = calculateCartQuantity();
    document.querySelector('.checkout-header-cart-quantity-count').innerHTML = `${cartQuantity}`;
}

updateCartQuantityDisplay();

/**
 * Temporarily displays a quantity limit message for a cart item.
 * @param cartItemContainer - The container element of the cart item.
 */
function displayCartItemQuantityLimitMessage(cartItemContainer) {
    const messageElement = cartItemContainer.querySelector('.cart-item-quantity-limit-message');

    // Set the message to indicate the quantity limit
    messageElement.innerHTML = '<br>Quantity limit: 50';

    // Clear any existing timeout to prevent multiple messages
    if (cartItemContainer.timeoutId) {
        clearTimeout(cartItemContainer.timeoutId);
    }

    // Set a timeout to clear the message after a duration
    cartItemContainer.timeoutId = setTimeout(() => {
        messageElement.innerHTML = '';
    }, 3000);
}

/**
 * Saves the quantity of a cart item inputted by the user and updates displays.
 * @param productId - The unique identifier of the cart item to be updated in quantity.
 * @param cartItemContainer - The element that contains the quantity label and input field.
 */
function saveNewCartItemQuantity(productId, cartItemContainer) {
    const updateCartItemQuantityElement = cartItemContainer.querySelector(
        '.update-cart-item-quantity-input'
    );
    const newCartItemQuantity = parseInt(updateCartItemQuantityElement.value.trim(), 10);

    if (Number.isNaN(newCartItemQuantity) || newCartItemQuantity === '') {
        return;
    } else if (newCartItemQuantity === 0) {
        handleZeroCartItemQuantity(productId);
    } else if (newCartItemQuantity > 50) {
        handleInvalidCartItemQuantity(cartItemContainer);
    } else {
        handleValidCartItemQuantity(productId, cartItemContainer, newCartItemQuantity);
    }

    updateCartItemQuantityElement.blur();
}

/**
 * Handles the scenario when the quantity of a cart item is zero.
 * @param productId - The unique identifier of the cart item to be removed.
 */
function handleZeroCartItemQuantity(productId) {
    removeCartItem(productId);
    updateCartVisibility();
    updateCartQuantityDisplay();
    updateOrderSummaryDisplay();
}

/**
 * Handles the scenario when  when the quantity of a cart item exceeds the limit.
 * @param cartItemContainer - The element that contains the quantity label and input field.
 */
function handleInvalidCartItemQuantity(cartItemContainer) {
    displayCartItemQuantityLimitMessage(cartItemContainer);
}

/**
 * Handles the scenario when the quantity of a cart item is valid.
 * @param productId - The unique identifier of the cart item to be updated in quantity.
 * @param cartItemContainer - The element that contains the quantity label and input field.
 * @param newCartItemQuantity - The new quantity inputted by the user.
 */
function handleValidCartItemQuantity(productId, cartItemContainer, newCartItemQuantity) {
    // Update the cart item quantity label
    cartItemContainer.querySelector('.cart-item-quantity-count').innerHTML =
        String(newCartItemQuantity);

    // Remove the class added to the container fediting
    cartItemContainer.classList.remove('editing-cart-item-quantity');

    updateCartItemQuantity(productId, newCartItemQuantity);
    updateCartItemPriceDisplay(productId, cartItemContainer, newCartItemQuantity);
    updateCartQuantityDisplay();
    updateOrderSummaryDisplay();
}

/**
 * Removes a cart item from the page and updates related elements.
 * @param productId - The unique identifier of the cart item to be removed.
 */
function removeCartItemDisplay(productId) {
    const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);

    if (!cartItemContainer) {
        return;
    }

    cartItemContainer.remove();
    updateCartVisibility();
    updatePlaceOrderButtonVisibility();
    updateOrderSummaryDisplay();
    updateCartQuantityDisplay();
}

/**
 * Update delivery date options based on the current day.
 * Delivery dates are up to 3 days after the current day.
 */
export function updateDeliveryDateOptions() {
    document.querySelectorAll('.delivery-option-date').forEach((dateElement, index) => {
        const currentDate = new Date();
        const daysToAdd = (index % 3) + 1;
        const formattedDeliveryDate = calculateFormattedDeliveryDate(currentDate, daysToAdd);
        dateElement.textContent = formattedDeliveryDate;
    });
}

updateDeliveryDateOptions();

/**
 * Calculate the formatted delivery date.
 * @param {Date} currentDate - The current date.
 * @param {number} daysToAdd - The number of days to add.
 * @returns {string} The formatted date string.
 */
function calculateFormattedDeliveryDate(currentDate, daysToAdd) {
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(currentDate.getDate() + daysToAdd);
    return deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Add an event listener to each delivery date option for radio button selection.
 * When a delivery option date is clicked, the respective radio button is checked.
 */
export function addEventListenersToDeliveryDateOptions() {
    document.querySelectorAll('.delivery-option-date').forEach((dateElement) => {
        dateElement.addEventListener('click', () => {
            const radioInput = dateElement.parentNode.querySelector('.delivery-option-input');
            radioInput.checked = true;
        });
    });
}

addEventListenersToDeliveryDateOptions();

/**
 * Handles clicks outside cart item containers.
 * Removes 'editing-cart-item-quantity' class from all cart item containers.
 * @param {Event} event - The click event.
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
 * Attaches event listeners to the "Update Cart Item Quantity" buttons within the cart.
 * When a button is clicked, the corresponding cart item container is identified, and
 * specific classes are added to reveal an input field and button for updating the quantity.
 * Clicking the "Save" button or blurring the input field triggers the update of the cart item quantity.
 */
document.querySelector('.cart-items-container').addEventListener('click', (event) => {
    const updateButton = event.target.closest('.js-update-cart-item-quantity-button');
    if (updateButton) {
        const productId = updateButton.dataset.productId;
        const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);

        if (cartItemContainer) {
            cartItemContainer.classList.add('editing-cart-item-quantity');

            const saveButton = cartItemContainer.querySelector(
                '.save-new-cart-item-quantity-button'
            );
            const inputField = cartItemContainer.querySelector('.update-cart-item-quantity-input');

            const saveHandler = () => saveNewCartItemQuantity(productId, cartItemContainer);

            saveButton.addEventListener('click', saveHandler);
            inputField.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    saveHandler();
                }
            });
            inputField.addEventListener('blur', saveHandler);
        }
    }
});

/**
 * Handles the click event on "Remove Cart Item" buttons within the cart.
 * If a button is clicked, retrieves the 'productId', removes the cart item, and updates displays.
 * @param {Event} event - The click event.
 */
function handleRemoveCartItemButtonClick(event) {
    const removeButton = event.target.closest('.remove-cart-item-button');
    if (removeButton) {
        const productId = removeButton.dataset.productId;
        removeCartItem(productId);
        removeCartItemDisplay(productId);
        updateDeliveryDateOptions();
        addEventListenersToDeliveryDateOptions();
    }
}

document
    .querySelector('.cart-items-container')
    .addEventListener('click', handleRemoveCartItemButtonClick);

/**
 * Adds a product to the wish list by adding it to the 'wishList' array.
 * If the product is already in the wish list, no duplicates are added.
 * @param {string} productId - The unique identifier of the product to be added to the wish list.
 */
function addCartItemToWishList(productId) {
    const isProductAlreadyInWishList = wishList.some((product) => product.productId === productId);

    if (!isProductAlreadyInWishList) {
        wishList.push({ productId });
        updateWishListInLocalStorage();
        updateWishListVisibility();
    }
}

/**
 * Handles the click event for adding a product to the wish list.
 * If a button is clicked, the code retrieves the 'productId',
 * adds the product to the wish list, and updates displays.
 * @param {Event} event - The click event object.
 */
function handleAddToWishListButtonClick(event) {
    const addToWishListButton = event.target.closest('.add-product-to-wish-list-button');

    if (addToWishListButton) {
        const productId = addToWishListButton.dataset.productId;

        addCartItemToWishList(productId);
        removeCartItem(productId);
        removeCartItemDisplay(productId);
        updateDeliveryDateOptions();
        addEventListenersToDeliveryDateOptions();
    }
}

document
    .querySelector('.cart-items-container')
    .addEventListener('click', handleAddToWishListButtonClick);
