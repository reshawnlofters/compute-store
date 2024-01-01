import { products } from './home-page.js';
import { findProductById, formatCurrency } from '../scripts/shared/utils.js';

/**
 * Retrieves the 'cart' and 'wishList' arrays from local storage.
 * If no values are found, assign empty arrays to both variables.
 */
export let cart = JSON.parse(localStorage.getItem('cart')) || [];
export let wishList = JSON.parse(localStorage.getItem('wishList')) || [];

export function updateCartInLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateWishListInLocalStorage() {
    localStorage.setItem('wishList', JSON.stringify(wishList));
}

/**
 * Adds a product to the cart and increases the quantity of a product already in the cart.
 * Ensures the quantity of a product added to the cart does not exceed the limit (50).
 * @param {string} productId - The unique identifier of the product to be added to the cart.
 * @param {number} productQuantity - The quantity of the product the user wants to add to the cart.
 */
export function addProductToCart(productId, productQuantity) {
    const product = findProductById(productId);

    if (!product) {
        return;
    }

    // Check if the product is already in the cart
    let matchingCartItem = cart.find((cartItem) => cartItem.productId === productId);

    if (matchingCartItem) {
        matchingCartItem.quantity += productQuantity;
        matchingCartItem.quantity = Math.min(matchingCartItem.quantity, 50);
    } else {
        cart.push({
            productId,
            quantity: productQuantity,
            priceInCents: product.priceInCents,
        });
    }

    updateCartInLocalStorage();
}

/**
 * Removes a cart item from the 'cart' array.
 * @param {string} productId - The unique identifier of the cart item to be removed.
 */
export function removeCartItem(productId) {
    const cartItemIndex = cart.findIndex((cartItem) => cartItem.productId === productId);

    if (cartItemIndex !== -1) {
        cart.splice(cartItemIndex, 1);
        updateCartInLocalStorage();
    }
}

/**
 * Calculates the total quantity of cart items.
 * @returns {number} - The total quantity of items in the cart.
 */
export function calculateQuantityOfCartItems() {
    return cart.reduce((totalQuantity, cartItem) => totalQuantity + cartItem.quantity, 0);
}

export function calculateQuantityOfWishListItems() {
    return wishList.length;
}

/**
 * Updates the quantity of a cart item in the 'cart' array based on input.
 * @param {string} productId - The unique identifier of the cart item to be updated.
 * @param {number} newQuantity - The new quantity for the cart item.
 */
export function updateCartItemQuantity(productId, newQuantity) {
    const cartItem = cart.find((item) => item.productId === productId);

    if (cartItem) {
        cartItem.quantity = newQuantity;
        updateCartInLocalStorage();
    }
}

/**
 * Updates the price of a cart item displayed based on input.
 * @param {string} productId - The unique identifier of the cart item to be updated in quantity.
 * @param {Element} cartItemContainer - The element that holds the price element.
 * @param {number} newQuantity - The new cart item quantity inputted by the user.
 */
export function updateCartItemPriceDisplay(productId, cartItemContainer, newQuantity) {
    const cartItemPriceElement = cartItemContainer.querySelector('.product-price');
    const matchingProduct = findProductById(productId);

    if (matchingProduct) {
        cartItemPriceElement.innerHTML = formatCurrency(matchingProduct.priceInCents * newQuantity);
    }
}

/**
 * Calculates the total cost of all cart items.
 * @returns {number} The total cost in cents.
 */
export function calculateCartItemTotalCost() {
    return cart.reduce(
        (totalCost, cartItem) => totalCost + cartItem.priceInCents * cartItem.quantity,
        0
    );
}

export function clearCart() {
    cart = [];
    updateCartInLocalStorage();
}
