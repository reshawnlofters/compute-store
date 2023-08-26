import { cart, removeFromCart, calculateCartQuantity, updateCartItemQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';


// variable to store the generated html for each cart item
let cartSummaryHTML = '';


// iterate through the cart
cart.forEach((cartItem) => {
    // variable to store the product id of the current cart item
    const productId = cartItem.productId;


    // variable to store a matching product
    let matchingProduct;


    // determine if the current cart item is in the array of products
    // if so, store the product
    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });


    // store the generated html for a product
    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
        </div>


        <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}">


            <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    $${(formatCurrency(matchingProduct.priceCents))}
                </div>
                <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-quantity-link link-primary"
                        data-product-id="${matchingProduct.id}">
                        Update
                    </span>
                    <input class="quantity-input">
                    <span class="save-quantity-link link-primary">Save</span>
                    <span class="delete-quantity-link js-delete-quantity-link 
                    link-primary" data-product-id="${matchingProduct.id}">
                        Delete
                    </span>
                </div>
            </div>


            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                <div class="delivery-option">
                    <input type="radio" checked class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
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
                        name="delivery-option-${matchingProduct.id}">
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
                        name="delivery-option-${matchingProduct.id}">
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


// add generated html to the checkout page
document.querySelector('.order-summary').innerHTML = cartSummaryHTML;

// function to update cart quantity
function updateCartQuantity() {
    // get the cart quantity
    const cartQuantity = calculateCartQuantity();

    // display the cart quantity
    document.querySelector('.js-return-to-home-link')
        .innerHTML = `${cartQuantity} items`;
}

updateCartQuantity();

// function to save new cart item quantities
function saveNewCartItemQuantity(productId, container) {
    // get the quantity input element value and convert it to a number
    const newCartItemQuantity = Number(container.querySelector('.quantity-input').value);
    
    // update the cart item quantity displayed on the page
    const quantityLabel = container.querySelector('.quantity-label');
    quantityLabel.innerHTML = newCartItemQuantity;
    
    // remove the product from the cart if the new quantity is 0
    if (newCartItemQuantity === 0) {
        removeFromCart(productId);
        container.remove();
    }
    
    // remove the class added to the product container
    container.classList.remove('is-editing-quantity');
    
    // update the cart item and cart quantity
    updateCartItemQuantity(productId, newCartItemQuantity);
    updateCartQuantity();

    // remove focus from input field after saving the quantity
    container.querySelector('.quantity-input').blur();
}

// iterate through the delete quantity buttons
document.querySelectorAll('.js-delete-quantity-link').forEach((button) => {
    // attach a click event listener to the delete button link
    button.addEventListener('click', () => {
        // get the product id value
        const productId = button.dataset.productId;

        removeFromCart(productId);

        // get the item specific container
        const container = document.querySelector(
            `.js-cart-item-container-${productId}`
        );

        // remove the removed product from the page
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
        
        // get the product container
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        
        // add a class to the product container to reveal the input and save element
        container.classList.add('is-editing-quantity');
        
        // get the save button element
        const saveButton = document.querySelector('.save-quantity-link');

        // attach a click event listener to the save button
        saveButton.addEventListener('click', () => {
            saveNewCartItemQuantity(productId, container);
        });

        // attach a keydown event listener to the quantity input field
        container.querySelector('.quantity-input').addEventListener('keydown', (event) => {
            // check if the user pressed 'Enter'
            if (event.key === 'Enter') {
                saveNewCartItemQuantity(productId, container);
            }
        });

        /* attach a blur event listener to the quantity input field to ensure,
           the product quantity is updated correctly when the input field loose focus */
        container.querySelector('.quantity-input').addEventListener('blur', () => {
            saveNewCartItemQuantity(productId, container);
        });
    });
});