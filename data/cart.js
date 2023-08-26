// get the cart array in local storage
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

// function to save to local storage
function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// function to add a product to the cart
export function addToCart(productId, quantitySelector) {
    // variable to store a matching cart item
    let matchingItem;

    // iterate through the cart
    cart.forEach((item) => {
        // store the product if it is in the cart
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    // increase the products quantity if it is in the cart 
    if (matchingItem) {
        matchingItem.quantity += quantitySelector;
    }
    
    // add the product to the cart if it is not in the cart
    else {
        cart.push({
            productId: productId,
            quantity: quantitySelector
        })
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