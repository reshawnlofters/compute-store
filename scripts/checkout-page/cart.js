import { products } from '../../data/home-page.js';
import { formatCurrency } from '../utils/format-currency.js';
import { updateWishListVisibility } from './wish-list.js';
import {
    updatePaymentSummaryDisplay,
    updatePlaceOrderButtonVisibility,
} from './payment-summary.js';
import {
    cart,
    wishList,
    calculateCartQuantity,
    updateCartItemQuantity,
    updateCartItemPriceDisplay,
    removeCartItem,
    updateWishListInLocalStorage,
} from '../../data/checkout-page.js';

/**
 * Generates HTML for displaying cart items.
 * Locates products in the 'products' array to access product details.
 */
function generateCartHTML() {
    let cartItemHTML = '';

    cart.forEach((cartItem) => {
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
                            <div class="cart-item-quantity-container">
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
                                <p class="cart-item-quantity-limit-message"></p>
                            </div>
                        </div>
                        <div>
                            <span class="add-product-to-wish-list-button link-primary" data-product-id="${
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

    document.querySelector('.cart-items-container').innerHTML = cartItemHTML;
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
 * Updates the visibility of the cart based on the quantity of cart items.
 */
export function updateCartVisibility() {
    if (calculateCartQuantity() > 0) {
        generateCartHTML();
    } else {
        generateEmptyCartHTML();
    }
}
updateCartVisibility();

export function updateCartQuantityDisplay() {
    document.querySelector(
        '.js-return-to-home-link'
    ).innerHTML = `${calculateCartQuantity()} items`;

    document.querySelector(
        '.js-payment-summary-items'
    ).innerHTML = `${calculateCartQuantity()}`;
}
updateCartQuantityDisplay();

/**
 * Temporarily displays a quantity limit message for a cart item.
 * @param cartItemContainer - The element that contains the message element.
 */
function displayCartItemQuantityLimitMessage(cartItemContainer) {
    const messageElement = cartItemContainer.querySelector(
        '.cart-item-quantity-limit-message'
    );

    messageElement.innerHTML = '<br>Quantity limit: 50';

    if (cartItemContainer.timeoutId) {
        clearTimeout(cartItemContainer.timeoutId);
    }

    cartItemContainer.timeoutId = setTimeout(() => {
        messageElement.innerHTML = '';
    }, 4000);
}

/**
 * Saves the quantity of a cart item inputted by the user and updates displays.
 * @param productId - The unique identifier of the cart item to be updated in quantity.
 * @param cartItemContainer - The element that contains the quantity label and input field.
 */
function saveNewCartItemQuantity(productId, cartItemContainer) {
    const updateCartItemQuantityInputElement = cartItemContainer.querySelector(
        '.update-cart-item-quantity-input'
    );
    const newCartItemQuantity = parseInt(
        updateCartItemQuantityInputElement.value.trim(),
        10
    );

    if (isNaN(newCartItemQuantity) || newCartItemQuantity === '') {
        return;
    } else if (newCartItemQuantity === 0) {
        removeCartItem(productId);
        updateCartVisibility();
        updateCartQuantityDisplay();
    } else if (newCartItemQuantity > 50) {
        displayCartItemQuantityLimitMessage(cartItemContainer);
    } else {
        // update the quantity label value
        cartItemContainer.querySelector('.cart-item-quantity-label').innerHTML =
            String(newCartItemQuantity);

        // remove the class added to the container for editing
        cartItemContainer.classList.remove('is-editing-quantity');

        updateCartItemQuantity(productId, newCartItemQuantity);
        updateCartItemPriceDisplay(
            productId,
            cartItemContainer,
            newCartItemQuantity
        );
        updateCartQuantityDisplay();
        updatePaymentSummaryDisplay();
    }

    updateCartItemQuantityInputElement.blur();
}

/**
 * Removes a cart item from the page and updates elements related to the cart.
 * @param productId - The unique identifier of the cart item to be removed.
 */
function removeCartItemDisplay(productId) {
    const cartItemContainer = document.querySelector(
        `.js-cart-item-container-${productId}`
    );

    if (cartItemContainer) {
        cartItemContainer.remove();
    }

    updateCartVisibility();
    updatePlaceOrderButtonVisibility();
    updatePaymentSummaryDisplay();
    updateCartQuantityDisplay();
}

/**
 * Attaches a click event listener to the page. When a click event occurs, the code checks
 * if the click target is not inside a cart item container. If it is not inside a cart item
 * container, the code removes the 'is-editing-quantity' class from all cart item containers.
 * The class displays the elements for updating a cart item quantity.
 */
document.addEventListener('click', (event) => {
    if (!event.target.closest('.cart-item-container')) {
        const cartItemContainers = document.querySelectorAll(
            '.cart-item-container'
        );
        cartItemContainers.forEach((container) => {
            container.classList.remove('is-editing-quantity');
        });
    }
});

/**
 * Attaches a click event listener to the element that holds all "Update Cart Item Quantity"
 * buttons using event delegation. If a button is clicked, the `productId` and corresponding
 * cart item container is retrieved. A class is then added to the container to reveal an
 * input field and button to save changes.
 */
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

/**
 * Attaches a click event listener to the element that holds all "Delete Cart Item"
 * buttons using event delegation. If a button is clicked, the code gets the 'productId',
 * removes the cart item, and updates displays.
 */
document
    .querySelector('.cart-items-container')
    .addEventListener('click', (event) => {
        setTimeout(() => {
            if (event.target.classList.contains('js-delete-cart-item-button')) {
                const productId = event.target.dataset.productId;
                removeCartItem(productId);
                removeCartItemDisplay(productId);
            }
        }, 500);
    });

/**
 * Adds a product to the wish list by adding it to the 'wishList' array.
 * @param productId - The unique identifier of the product to be added to the wish list.
 */
function addProductToWishList(productId) {
    let matchingProduct;

    wishList.forEach((product) => {
        if (productId === product.productId) {
            matchingProduct = product;
        }
    });

    if (!matchingProduct) {
        wishList.push({
            productId,
        });
    }

    updateWishListInLocalStorage();
    updateWishListVisibility();
}

/**
 * Attaches a click event listener to the element that holds all "Add Product to Wish List"
 * buttons using event delegation. If a button is clicked, the code gets the 'productId',
 * adds the product to the wish list, and updates displays.
 */
document
    .querySelector('.cart-items-container')
    .addEventListener('click', (event) => {
        if (
            event.target.classList.contains('add-product-to-wish-list-button')
        ) {
            const productId = event.target.dataset.productId;

            addProductToWishList(productId);
            removeCartItem(productId);
            removeCartItemDisplay(productId);
        }
    });
