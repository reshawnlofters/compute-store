import { products } from '../data/products.js';
import { formatCurrency } from '../scripts/utils/money.js';

// get the cart array in local storage
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

// function to save to local storage
function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// function to add a product to the cart
export function addToCart(productId, quantitySelector) {
    // find the product with the given id from the global products array
    const product = products.find((product) => product.id === productId);

    if (!product) {
        // handle the case where the product with the given id doesn't exist
        return;
    }

    // variable to store a matching cart item
    let matchingCartItem;

    // iterate through the cart
    cart.forEach((cartItem) => {
        // store the product if it is already in the cart
        if (productId === cartItem.productId) {
            matchingCartItem = cartItem;
        }
    });

    if (matchingCartItem) {
        // increase the product quantity if the product is already in the cart
        matchingCartItem.quantity += quantitySelector;
    }

    else {
        // add the product to the cart
        cart.push({
            productId: productId,
            quantity: quantitySelector,
            priceCents: product.priceCents  // price from the global products array
        });
    }

    saveToStorage();
}

// function to remove a product from the cart
export function removeFromCart(productId) {
    // iterate through the cart and return an array without the product
    cart = cart.filter((cartItem) => {
        return cartItem.productId !== productId;
    });

    saveToStorage();
}

// function to calculate the cart quantity
export function calculateCartQuantity() {
    // variable to store the cart quantity
    let cartQuantity = 0;

    // iterate through the cart items
    cart.forEach((cartItem) => {
        // store the quantity of each cart item
        cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
}

// function to update the quantity of a cart item
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

// function to update the price of a cart item
export function updateCartItemPriceDisplayed(productId, cartItemContainer, newCartItemQuantity) {
    // get the cart item price element
    const cartItemPriceElement = cartItemContainer.querySelector('.product-price');

    // iterate through the products
    products.forEach((product) => {
        if (product.id === productId) {
            // update the cart item price displayed on the page
            cartItemPriceElement.innerHTML = `$${formatCurrency(product.priceCents * newCartItemQuantity)}`;
        }
    });
}

// function to calculate the total cost of all cart items
export function calculateCartTotalCost() {
    // variable to store the cart total
    let cartTotalCost = 0.0;

    // iterate through the cart
    cart.forEach((cartItem) => {
        // store the price of each cart item
        cartTotalCost += cartItem.priceCents * cartItem.quantity;
    })

    return formatCurrency(cartTotalCost);
}