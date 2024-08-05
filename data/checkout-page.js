/*
    Compute Store (E-commerce Store Simulator)

    Copyright © 2024 Reshawn Lofters

    This file is part of the Compute Store project, which is licensed under a Custom License.
    Please see the LICENSE file in the root of this project repository for full license details.
*/

import { findProductById, formatCurrency } from '../scripts/shared/utils.js';

/**
 * Retrieves the 'cart' and 'wishList' data from local storage.
 * - If no data is found, empty arrays are assigned to both variables.
 */
export let cart = JSON.parse(localStorage.getItem('cart')) || [];
export let wishList = JSON.parse(localStorage.getItem('wishList')) || [];

/**
 * Updates the 'cart' data in local storage.
 */
export function updateCartInLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Updates the 'wishList' data in local storage.
 */
export function updateWishListInLocalStorage() {
    localStorage.setItem('wishList', JSON.stringify(wishList));
}

/**
 * Adds a product to the cart or updates the quantity of a product already in the cart.
 * - If the product is already in the cart, the quantity is updated, ensuring it is below the limit (50).
 * - If the product is not in the cart, it is added to the cart with the specified quantity.
 * @param {string} productId - The unique identifier of the product.
 * @param {number} productQuantity - The quantity of the product.
 */
export function addProductToCart(productId, productQuantity) {
    const product = findProductById(productId);

    if (!product) {
        return;
    }

    // Check if the product is already in the cart
    let matchingCartItem = cart.find((cartItem) => cartItem.productId === productId);

    // If the product is already in the cart, update the product quantity
    // If the product is not in the cart, add it to the cart
    if (matchingCartItem) {
        matchingCartItem.quantity += productQuantity;

        // Ensure the product quantity is below the limit (50)
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
 * Removes a cart item from the cart.
 * @param {string} productId - The unique identifier of the cart item.
 */
export function removeCartItem(productId) {
    const cartItemIndex = cart.findIndex((cartItem) => cartItem.productId === productId);

    if (cartItemIndex !== -1) {
        // Remove the cart item
        cart.splice(cartItemIndex, 1);

        updateCartInLocalStorage();
    }
}

/**
 * Calculates the total quantity of cart items.
 * @returns {number} - The total quantity of cart items.
 */
export function calculateQuantityOfCartItems() {
    return cart.reduce((totalQuantity, cartItem) => totalQuantity + cartItem.quantity, 0);
}

/**
 * Calculates the total quantity of wish list items.
 * @returns {number} - The total quantity of wish list items.
 */
export function calculateQuantityOfWishListItems() {
    return wishList.length;
}

/**
 * Updates the quantity of a cart item based on user input.
 * @param {string} productId - The unique identifier of the cart item.
 * @param {number} newQuantity - The new cart item quantity inputted by the user.
 */
export function updateCartItemQuantity(productId, newQuantity) {
    const cartItem = cart.find((item) => item.productId === productId);

    if (cartItem) {
        cartItem.quantity = newQuantity;

        updateCartInLocalStorage();
    }
}

/**
 * Updates the total price of a cart item displayed in the cart based on the cart item quantity.
 * @param {string} productId - The unique identifier of the cart item.
 * @param {Element} cartItemContainer - The container element of the cart item.
 * @param {number} newQuantity - The new cart item quantity inputted by the user.
 */
export function updateCartItemPriceDisplay(productId, cartItemContainer, newQuantity) {
    const cartItemPriceElement = cartItemContainer.querySelector('.product-price');
    const matchingCartItem = findProductById(productId);

    if (matchingCartItem) {
        cartItemPriceElement.innerHTML = formatCurrency(matchingCartItem.priceInCents * newQuantity);
    }
}

/**
 * Calculates the total cost of all cart items.
 * @returns {number} The total cost of all cart items in cents.
 */
export function calculateCartItemTotalCost() {
    return cart.reduce(
        (totalCost, cartItem) => totalCost + cartItem.priceInCents * cartItem.quantity,
        0
    );
}

/**
 * Removes all cart items from the cart.
 */
export function clearCart() {
    cart = [];
    updateCartInLocalStorage();
}
