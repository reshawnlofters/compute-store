// create array to store the cart items
export let cart = [];

// function to add a product to the cart
export function addToCart(productId) {
    // variable to store a matching cart item
    let matchingItem;

    // iterate through the cart
    cart.forEach((item) => {
        // store the product if it is in the array
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    // increase the quantity of the product by 1 if it's a duplicate
    if (matchingItem) {
        matchingItem.quantity += 1;
    }
    
    // add the product to the cart
    else {
        cart.push({
            productId: productId,
            quantity: 1 
        })
    }
}