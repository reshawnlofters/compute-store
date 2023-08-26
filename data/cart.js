// get the cart array in local storage
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

// function to save to local storage
function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart))
}

// function to add a product to the cart
export function addToCart(productId, quantitySelector) {
    // variable to store a matching cart item
    let matchingItem;

    // iterate through the cart
    cart.forEach((item) => {
        // if the prdouct is in the cart, store it
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    // if the product is in the cart,
    // increase it's cart quantity by the quantity selector value
    if (matchingItem) {
        matchingItem.quantity += quantitySelector;
    }
    
    // if the product is not in the cart, add it to the cart
    else {
        cart.push({
            productId: productId,
            quantity: quantitySelector
        })
    }
    
    saveToStorage();
}

// function to calculate the cart quantity
export function calculateCartQuantity() {
    // create variable to store the cart quantity
    let cartQuantity = 0;

    // iterate through the cart items
    cart.forEach((cartItem) => {
        // store the quantity of each cart item
        cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
}