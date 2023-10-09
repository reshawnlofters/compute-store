import { products } from '../../data/products.js';
import { formatCurrency } from '../utils/format-currency.js';
import {
    savedCartItems,
    calculateSavedCartItemsQuantity,
    addCartItem,
    cart,
    saveToLocalStorage,
    updateCartItemQuantity,
} from '../../data/cart.js';
import {
    updateCartItemVisibility,
    updatePlaceOrderButtonVisibility,
} from './checkout-page.js';

/**
 * This function generates the HTML for each saved cart item in the `savedCartItems` array.
 * It iterates through each saved cart item and finds the matching product in the `products`
 * array based on the `productId`. It then generates the HTML using the product details.
 * The generated HTML is stored in the `savedCartItemHTML` variable.
 * */
function generateSavedCartItemsHTML() {
    let savedCartItemHTML = '';

    savedCartItems.forEach((savedCartItem) => {
        const productId = savedCartItem.productId;
        let matchingProduct;

        products.forEach((product) => {
            if (product.id === productId) {
                matchingProduct = product;
            }
        });

        savedCartItemHTML += `
            <div class="saved-cart-item-container js-saved-cart-item-container-${
                matchingProduct.id
            }">
                <div class="saved-cart-item-container-grid">
                    <img class="product-image" src="${matchingProduct.image}">

                    <div class="saved-cart-item-details-container">
                        <div>
                            <div class="product-name">
                                ${matchingProduct.name}
                            </div>
                            <div class="product-price">
                                $${formatCurrency(matchingProduct.priceInCents)}
                            </div>
                        </div>
                        <span class="add-saved-cart-item-to-cart-button link-primary" data-product-id="${
                            matchingProduct.id
                        }">
                            Add to Cart
                        </span>
                    </div>
                </div>
            </div>`;
    });

    // display saved cart items
    document.querySelector('.saved-cart-items-container').innerHTML =
        savedCartItemHTML;
}

// This function generates the HTML for when the saved cart items section is empty
function generateEmptySavedCartItemsHTML() {
    document.querySelector('.saved-cart-items-container').innerHTML = `
        <div class="empty-saved-cart-items-container">
            <div class="empty-saved-cart-items-message-container">
                <div>
                    <span>Looks like it's empty!</span><br><br>
                    Why not add something?
                </div>
            </div>
            <img class="empty-saved-cart-items-container-img" src="images/icons/save.png">
        </div>
    `;
}

// This function updates the saved cart items visibility based on the quantity
export function updateSavedCartItemsVisibility() {
    if (calculateSavedCartItemsQuantity() > 0) {
        generateSavedCartItemsHTML();
    } else {
        generateEmptySavedCartItemsHTML();
    }
}

updateSavedCartItemsVisibility();

// Function to remove a saved cart item from the `savedCartItems` array and displays.
function removeSavedCartItem(productId) {
    // retrieve the saved cart item index with the `productId`
    const savedCartItemIndex = savedCartItems.findIndex(
        (savedCartItem) => savedCartItem.productId === productId
    );

    // if the product is found, remove it from the `savedCartItems` array
    if (savedCartItemIndex !== -1) {
        savedCartItems.splice(savedCartItemIndex, 1);
    }

    const savedCartItemContainer = document.querySelector(
        `.js-saved-cart-item-container-${productId}`
        );
        
    if (savedCartItemContainer) {
        savedCartItemContainer.remove();
    }

    saveToLocalStorage();
}

/**
 * This code attaches a click event listener to the container that holds all
 * "add saved cart item to cart" buttons using event delegation. If a button is clicked,
 * the code retrieves the button `productId`, adds the product to the cart and,
 * removes the saved cart item.
 * */
document
    .querySelector('.saved-cart-items-container')
    .addEventListener('click', (event) => {
        if (
            event.target.classList.contains(
                'add-saved-cart-item-to-cart-button'
            )
        ) {
            const productId = event.target.dataset.productId;

            addCartItem(productId, 1);
            removeSavedCartItem(productId);
            updateCartItemVisibility();
            updateSavedCartItemsVisibility();
            updatePlaceOrderButtonVisibility();
        }
    });
