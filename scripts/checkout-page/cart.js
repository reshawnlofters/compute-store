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
                                <input class="update-cart-item-quantity-input">
                                <span class="save-new-cart-item-quantity-button link-primary">Save</span>
                                <p class="cart-item-quantity-limit-message"></p>
                            </div>
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
                            <div class="delivery-option-date">
                                Tuesday, June 21
                            </div>
                        </div>
                        <div class="delivery-option">
                            <input type="radio" class="delivery-option-input"
                                name="delivery-option-${matchingProduct.id}">
                            <div class="delivery-option-date">
                                Wednesday, June 15
                            </div>
                        </div>
                        <div class="delivery-option">
                            <input type="radio" class="delivery-option-input"
                                name="delivery-option-${matchingProduct.id}">
                            <div class="delivery-option-date">
                                Monday, June 13
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    document.querySelector('.cart-items-container').innerHTML = cartHTML;
}

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

    // Set the message to indicate a quantity limit of 50
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

function handleClickOutsideCartItemContainer(event) {
    if (!event.target.closest('.cart-item-container')) {
        const cartItemContainers = document.querySelectorAll('.cart-item-container');
        cartItemContainers.forEach((container) => {
            container.classList.remove('editing-cart-item-quantity');
        });
    }
}

/**
 * Click event listener to handle interactions outside of cart item containers.
 * If the click target is not inside a cart item container, remove the
 * 'editing-cart-quantity' class from all cart item containers.
 */
document.addEventListener('click', handleClickOutsideCartItemContainer);

/**
 * Attaches event listeners to the "Update Cart Item Quantity" buttons within the cart.
 * When a button is clicked, the corresponding cart item container is identified, and
 * specific classes are added to reveal an input field and button for updating the quantity.
 * Clicking the "Save" button or blurring the input field triggers the update of the cart item quantity.
 */
document.querySelector('.cart-items-container').addEventListener('click', (event) => {
    if (event.target.classList.contains('js-update-cart-item-quantity-button')) {
        const productId = event.target.dataset.productId;
        const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);

        cartItemContainer.classList.add('editing-cart-item-quantity');
        const saveButton = cartItemContainer.querySelector('.save-new-cart-item-quantity-button');
        const inputField = cartItemContainer.querySelector('.update-cart-item-quantity-input');

        saveButton.addEventListener('click', () =>
            saveNewCartItemQuantity(productId, cartItemContainer)
        );
        inputField.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                saveNewCartItemQuantity(productId, cartItemContainer);
            }
        });
        inputField.addEventListener('blur', () =>
            saveNewCartItemQuantity(productId, cartItemContainer)
        );
    }
});

/**
 * Attaches a click event listener to the element that holds all "Remove Cart Item"
 * buttons using event delegation. If a button is clicked, the code retrieves the 'productId',
 * removes the cart item, and updates displays.
 */
document
    .querySelector('.cart-items-container')
    .addEventListener('click', handleRemoveCartItemButtonClick);

function handleRemoveCartItemButtonClick(event) {
    if (event.target.classList.contains('remove-cart-item-button')) {
        const productId = event.target.dataset.productId;
        removeCartItem(productId);
        removeCartItemDisplay(productId);
    }
}

/**
 * Adds a product to the wish list by adding it to the 'wishList' array.
 * If the product is already in the wish list, no duplicates are added.
 * @param productId - The unique identifier of the product to be added to the wish list.
 */
function addCartItemToWishList(productId) {
    const matchingProduct = wishList.find((product) => productId === product.productId);

    if (!matchingProduct) {
        wishList.push({
            productId,
        });
    }

    updateWishListInLocalStorage();
    updateWishListVisibility();
}

function handleAddToWishListButtonClick(event) {
    if (event.target.classList.contains('add-product-to-wish-list-button')) {
        const productId = event.target.dataset.productId;

        addCartItemToWishList(productId);
        removeCartItem(productId);
        removeCartItemDisplay(productId);
    }
}

/**
 * Attaches a click event listener to the element that holds all "Add Product to Wish List"
 * buttons using event delegation. If a button is clicked, the code retrieves the 'productId',
 * adds the product to the wish list, and updates displays.
 */
document
    .querySelector('.cart-items-container')
    .addEventListener('click', handleAddToWishListButtonClick);
