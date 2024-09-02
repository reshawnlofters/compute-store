import { addProductToCart, clearCart, getCart, removeCartItem, updateCartItemQuantity } from '../../data/checkout-page.js';
import { findProductById } from '../../scripts/shared/utils.js';

/**
 * Tests if the `addProductToCart` function adds a product to the cart.
 * - Uses the ID of a product from the `products` array for testing.
 */
test('adds product to cart', () => {
    const productId = '6b07d4e7-f540-454e-8a1e-363f25dbae7d';
    const productQuantity = 1;

    addProductToCart(productId, productQuantity);

    // Find the product in the cart
    const cart = getCart();
    const productInCart = cart.find((cartItem) => cartItem.productId === productId);

    let expectedProductInCart = {
        productId,
        quantity: productQuantity,
        priceInCents: findProductById(productId).priceInCents,
    };

    expect(productInCart).toEqual(expectedProductInCart);
});

/**
 * Tests if the `removeCartItem` function removes a cart item.
 * - Uses the ID of a product from the `products` array for testing.
*/
test('removes cart item', () => {
    let productId = '6b07d4e7-f540-454e-8a1e-363f25dbae7d';

    addProductToCart(productId);
    removeCartItem(productId);

    // Find the product in the cart
    let cart = getCart();
    const productInCart = cart.find((cartItem) => cartItem.productId === productId);
    
    expect(productInCart).toBeUndefined();
});

/**
 * Tests if the `updateCartItemQuantity` function updates the quantity of a cart item.
 * - Uses the ID of a product from the `products` array for testing.
 */
test('updates cart item quantity', () => {
    let productId = '6b07d4e7-f540-454e-8a1e-363f25dbae7d';
    let productQuantity = 1;
    let newProductQuantity = 2;
    let cartItemQuantity = 0;

    addProductToCart(productId, productQuantity);
    updateCartItemQuantity(productId, newProductQuantity);

    // Get the cart item quantity
    let cart = getCart();
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            cartItemQuantity = cartItem.quantity;
        }
    });
    
    expect(cartItemQuantity).toEqual(newProductQuantity);
});

/**
 * Tests if the `clearCart` function clears the cart.
 */
test('clears the cart', () => {
    clearCart();
    expect(getCart()).toEqual([]);
});
