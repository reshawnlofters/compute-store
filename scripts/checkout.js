import { cart, removeFromCart, calculateCartQuantity, updateCartItemQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

// variable to store the generated html for each cart item
let cartHTML = '';

// iterate through the cart
cart.forEach((cartItem) => {
    // variable to store the product id of a cart item
    const productId = cartItem.productId;

    // variable to store a matching cart item
    let matchingCartItem;

    // iterate through the products
    products.forEach((product) => {
        // store the product if it is in the cart
        if (product.id === productId) {
            matchingCartItem = product;
        }
    });

    // store the generated html for each cart item
    cartHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingCartItem.id}">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingCartItem.image}">

            <div class="cart-item-details">
                <div class="product-name">
                    ${matchingCartItem.name}
                </div>
                <div class="product-price">
                    $${(formatCurrency(matchingCartItem.priceCents))}
                </div>
                <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-quantity-link link-primary"
                        data-product-id="${matchingCartItem.id}">
                        Update
                    </span>
                    <input class="quantity-input">
                    <span class="save-quantity-link link-primary">Save</span>
                    <span class="delete-quantity-link js-delete-quantity-link 
                    link-primary" data-product-id="${matchingCartItem.id}">
                        Delete
                    </span>
                </div>
                <p class="quantity-limit-message"></p>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                <div class="delivery-option">
                    <input type="radio" checked class="delivery-option-input"
                        name="delivery-option-${matchingCartItem.id}">
                    <div>
                        <div class="delivery-option-date">
                            Tuesday, June 21
                        </div>
                        <div class="delivery-option-price">
                            FREE Shipping
                        </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio" class="delivery-option-input"
                        name="delivery-option-${matchingCartItem.id}">
                    <div>
                        <div class="delivery-option-date">
                            Wednesday, June 15
                        </div>
                        <div class="delivery-option-price">
                            $4.99 - Shipping
                        </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio" class="delivery-option-input"
                        name="delivery-option-${matchingCartItem.id}">
                    <div>
                        <div class="delivery-option-date">
                            Monday, June 13
                        </div>
                        <div class="delivery-option-price">
                            $9.99 - Shipping
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
});

// add the generated html to the page
document.querySelector('.order-summary').innerHTML = cartHTML;

// function to update the cart quantity
function updateCartQuantity() {
    // get the cart quantity
    const cartQuantity = calculateCartQuantity();

    // display the cart quantity
    document.querySelector('.js-return-to-home-link')
        .innerHTML = `${cartQuantity} items`;
}

updateCartQuantity();

// function to display the quantity limit message
function displayQuantityLimitMessage(container) {
    // get the quantity limit message element for the specific cart item container
    const quantityLimitMessage = container.querySelector('.quantity-limit-message');

    // add the message
    quantityLimitMessage.innerHTML = 'Quantity limit reached (50)';

    // clear any previous timeouts
    if (container.timeoutId) {
        clearTimeout(container.timeoutId);
    }

    // set a timeout for the message and store the timeout id in the container
    container.timeoutId = setTimeout(() => {
        // remove the message
        quantityLimitMessage.innerHTML = '';
    }, 4000);
}

// function to save the new cart item quantities
function saveNewCartItemQuantity(productId, container) {
    // get the quantity input field value and convert it to a number
    const newCartItemQuantity = Number(container.querySelector('.quantity-input').value);
    
    // display an error message if the new quantity is above the limit (50)
    if (newCartItemQuantity > 50) {
        displayQuantityLimitMessage(container);
        return;
    }

    // remove the product from the cart if the new quantity is set to 0
    if (newCartItemQuantity === 0) {
        removeFromCart(productId);
        container.remove();
    } 
    
    else {
        // update the cart item quantity displayed on the page
        const quantityLabel = container.querySelector('.quantity-label');
        quantityLabel.innerHTML = newCartItemQuantity;
        
        // remove the class added to the product container
        container.classList.remove('is-editing-quantity');
        
        updateCartItemQuantity(productId, newCartItemQuantity);
        updateCartQuantity();
    }

    // remove focus from the quantity input field after saving the new quantity
    container.querySelector('.quantity-input').blur();
}

// iterate through the delete quantity buttons
document.querySelectorAll('.js-delete-quantity-link').forEach((button) => {
    // attach a click event listener to the delete button
    button.addEventListener('click', () => {
        // get the product id
        const productId = button.dataset.productId;

        removeFromCart(productId);

        // get the cart item container
        const container = document.querySelector(
            `.js-cart-item-container-${productId}`
        );

        // remove the removed cart item from the page
        container.remove();
        updateCartQuantity();
    });
});

// iterate through the update quantity buttons
document.querySelectorAll('.js-update-quantity-link').forEach((button) => {
    // attach a click event listener to the update quantity buttons
    button.addEventListener('click', () => {
        // get the product id
        const productId = button.dataset.productId;
        
        // get the cart item container
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        
        // add a class to the product container to reveal the input and save element
        container.classList.add('is-editing-quantity');
        
        // get the save button element
        const saveButton = container.querySelector('.save-quantity-link');

        // attach a click event listener to the save button
        saveButton.addEventListener('click', () => {
            saveNewCartItemQuantity(productId, container);
        });

        // attach a keydown event listener to the quantity input field
        container.querySelector('.quantity-input').addEventListener('keydown', (event) => {
            // check if the user pressed the'Enter' key
            if (event.key === 'Enter') {
                saveNewCartItemQuantity(productId, container);
            }
        });

        /* attach a blur event listener to the quantity input field to ensure,
           the product quantity is updated correctly when the input field loses focus */
        container.querySelector('.quantity-input').addEventListener('blur', () => {
            saveNewCartItemQuantity(productId, container);
        });
    });
});