import { products } from '../data/products.js';
import { formatCurrency } from '../scripts/utils/money.js';

// initialize `cart` from local storage or use an empty array if no data is found
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

// This function saves the `cart` array to the browser's local storage as a JSON string
function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * This function adds a product to the cart or increases its quantity if it already exists in the cart.
 * @param productId - The productId parameter is the unique identifier of the product a user wants to
 * add to the cart. It is used to find the product in the global `products` array.
 * @param quantitySelector - The quantitySelector parameter represents the quantity of the product
 * that the user wants to add to the cart.
 */
export function addToCart(productId, quantitySelectorValue) {
    // find the product with the given `productId` from the global `products` array
    const product = products.find((product) => product.id === productId);

    // check if the product with the given `productId` in the global `products` array doesn't exit
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
        // increase product quantity
        matchingCartItem.quantity += quantitySelectorValue;
    } else {
        // add product to the cart
        cart.push({
            productId,
            quantity: quantitySelectorValue,
            priceInCents: product.priceInCents,
        });
    }

    saveToStorage();
}

/**
 * This function removes a product from the cart by filtering out the cart item with the specified
 * product id and then saves the updated cart to storage.
 * @param productId - The `productId` parameter is the unique identifier of the product that needs to
 * be removed from the cart.
 */
export function removeFromCart(productId) {
    // iterate through the cart and return an array without the specified product
    cart = cart.filter((cartItem) => {
        return cartItem.productId !== productId;
    });

    saveToStorage();
}

/**
 * This function calculates the total quantity of items in the cart.
 * @returns the total quantity of items in the cart.
 */
export function calculateCartQuantity() {
    let cartQuantity = 0;

    // iterate through the cart
    cart.forEach((cartItem) => {
        // store the quantity of each cart item
        cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
}

// This function updates the quantity of a cart item
export function updateCartItemQuantity(productId, newCartItemQuantity) {
    // iterate through the cart
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            // store the new cart item quantity
            cartItem.quantity = newCartItemQuantity;
        }
    });

    saveToStorage();
}

/**
 * This function updates the displayed price of a cart item based on the product id and new quantity.
 * @param productId - The unique identifier of the product that needs to be updated in the cart.
 * @param cartItemContainer - The `cartItemContainer` parameter is the container element that holds the
 * cart item on the page. It is used to find the specific cart item price element within the container.
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

    // iterate through the products
    products.forEach((product) => {
        if (product.id === productId) {
            // update the cart item price displayed on the page
            cartItemPriceElement.innerHTML = `$${formatCurrency(
                product.priceInCents * newCartItemQuantity
            )}`;
        }
    });
}

/**
 * This function calculates the total cost of all items in the cart.
 * @returns the total cost of all items in the cart, in cents.
 */
export function calculateCartItemTotalCost() {
    let cartItemTotalCostInCents = 0;

    // iterate through the cart
    cart.forEach((cartItem) => {
        // store the price of each cart item
        cartItemTotalCostInCents += cartItem.priceInCents * cartItem.quantity;
    });

    return cartItemTotalCostInCents;
}
