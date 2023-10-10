import { products } from './home-page.js';
import { formatCurrency } from '../scripts/utils/format-currency.js';

/**
 * Retrieve the 'cart' and 'wishList' array from local storage.
 * If no values are found, assign an empty array to both variables.
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
 * Adds a product to the cart if not already in the cart.
 * Increases the quantity of a product in the cart if the product already exists in the cart.
 * @param productId - The unique identifier of the product to be added to the cart.
 * @param quantitySelectorValue - The quantity of the product the user wants to add to the cart.
 */
export function addProductToCart(productId, quantitySelectorValue) {
    let matchingCartItem;
    const product = products.find((product) => product.id === productId);

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingCartItem = cartItem;
        }
    });

    if (matchingCartItem) {
        matchingCartItem.quantity += quantitySelectorValue;
    } else {
        cart.push({
            productId,
            quantity: quantitySelectorValue,
            priceInCents: product.priceInCents,
        });
    }

    updateCartInLocalStorage();
}

/**
 * Removes a cart item if found in the 'cart' array using the 'productId'.
 * @param productId - The unique identifier of the cart item to be removed.
 */
export function removeCartItem(productId) {
    const cartItemIndex = cart.findIndex(
        (cartItem) => cartItem.productId === productId
    );

    if (cartItemIndex !== -1) {
        cart.splice(cartItemIndex, 1);
        updateCartInLocalStorage();
    }
}

export function calculateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => (cartQuantity += cartItem.quantity));
    return cartQuantity;
}

export function calculateWishListQuantity() {
    return wishList.length;
}

export function updateCartItemQuantity(productId, newCartItemQuantity) {
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            cartItem.quantity = newCartItemQuantity;
        }
    });

    updateCartInLocalStorage();
}

/**
 * Updates the price display of a cart item based on the 'productId' and inputted quantity.
 * @param productId - The unique identifier of the cart item to be updated in quantity.
 * @param cartItemContainer - The element that holds the price element.
 * @param newCartItemQuantity - The new cart item quantity inputted by the user.
 */
export function updateCartItemPriceDisplay(
    productId,
    cartItemContainer,
    newCartItemQuantity
) {
    const cartItemPriceElement =
        cartItemContainer.querySelector('.product-price');

    products.forEach((product) => {
        if (product.id === productId) {
            cartItemPriceElement.innerHTML = `$${formatCurrency(
                product.priceInCents * newCartItemQuantity
            )}`;
        }
    });
}

export function calculateCartItemTotalCost() {
    let cartItemTotalCostInCents = 0;

    cart.forEach(
        (cartItem) =>
            (cartItemTotalCostInCents +=
                cartItem.priceInCents * cartItem.quantity)
    );

    return cartItemTotalCostInCents;
}

export function clearCart() {
    cart.forEach((cartItem) => removeCartItem(cartItem.productId));
}
