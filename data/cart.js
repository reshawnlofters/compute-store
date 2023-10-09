import { products } from '../data/products.js';
import { formatCurrency } from '../scripts/utils/format-currency.js';

/**
 * This code initializes the variables `cart` and `savedCartItems` by retrieving their
 * values from localStorage. If the values are not found in the localStorage, it assigns
 * an empty array to both variables.
 * */
export let cart = JSON.parse(localStorage.getItem('cart')) || [];
export let savedCartItems =
    JSON.parse(localStorage.getItem('savedCartItems')) || [];

// This function saves the `cart` and `savedCartItems` array to localStorage
export function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('savedCartItems', JSON.stringify(savedCartItems));
}

/**
 * This function adds a cart item or increases its cart quantity if it already exists in the cart.
 * @param productId - The unique identifier of the product to be added to the cart.
 * @param quantitySelector - The quantity of the product the user wants to add to the cart.
 */
export function addCartItem(productId, quantitySelectorValue) {
    // find the product with the `productId` from the global `products` array
    const product = products.find((product) => product.id === productId);

    // check if the product doesn't exit
    if (!product) {
        return;
    }

    let matchingCartItem;

    // iterate through the cart to find a matching product
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            // store the product
            matchingCartItem = cartItem;
        }
    });

    if (matchingCartItem) {
        // increase the product quantity
        matchingCartItem.quantity += quantitySelectorValue;
    } else {
        // add the product to the cart
        cart.push({
            productId,
            quantity: quantitySelectorValue,
            priceInCents: product.priceInCents,
        });
    }

    saveToLocalStorage();
}

/**
 * This function removes a cart item based on the `productId` and updates the cart array.
 * @param productId - The unique identifier of the order to be removed.
 */
export function removeCartItem(productId) {
    // find the index of the cart item with the specified ID
    const cartItemIndex = cart.findIndex(
        (cartItem) => cartItem.productId === productId
    );

    // if the cart item is found, remove it from the cart array
    if (cartItemIndex !== -1) {
        cart.splice(cartItemIndex, 1);
        saveToLocalStorage();
    }
}

/**
 * This function calculates the total quantity of cart items.
 * @returns the total quantity of cart items.
 */
export function calculateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => (cartQuantity += cartItem.quantity));

    return cartQuantity;
}

/**
 * This function calculates the total quantity of saved cart items.
 * @returns the total quantity of saved cart items.
 */
export function calculateSavedCartItemsQuantity() {
    return savedCartItems.length;
}

// This function updates the quantity of a cart item
export function updateCartItemQuantity(productId, newCartItemQuantity) {
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            // store the quantity
            cartItem.quantity = newCartItemQuantity;
        }
    });

    saveToLocalStorage();
}

/**
 * This function updates cart item price displays based on the `productId` and new quantity.
 * @param productId - The unique identifier of the product to be updated in the cart.
 * @param cartItemContainer - The element that holds the cart item on the page.
 * It is used to find the specific cart item price element within the container.
 * @param newCartItemQuantity - The new quantity of the cart item.
 */
export function updateCartItemPriceDisplay(
    productId,
    cartItemContainer,
    newCartItemQuantity
) {
    // get the cart item price element
    const cartItemPriceElement =
        cartItemContainer.querySelector('.product-price');

    products.forEach((product) => {
        if (product.id === productId) {
            // update the price on the page
            cartItemPriceElement.innerHTML = `$${formatCurrency(
                product.priceInCents * newCartItemQuantity
            )}`;
        }
    });
}

/**
 * This function calculates the total cost of all cart items.
 * @returns the total cost of all cart items, in cents.
 */
export function calculateCartItemTotalCost() {
    let cartItemTotalCostInCents = 0;

    cart.forEach(
        (cartItem) =>
            (cartItemTotalCostInCents +=
                cartItem.priceInCents * cartItem.quantity)
    );

    return cartItemTotalCostInCents;
}

// This function clears all cart items
export function clearCart() {
    cart.forEach((cartItem) => removeCartItem(cartItem.productId));
}
