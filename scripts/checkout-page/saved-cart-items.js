import { products } from '../../data/products.js';
import { formatCurrency } from '../utils/format-currency.js';
import {
    savedCartItems,
    calculateSavedCartItemsQuantity,
} from '../../data/cart.js';

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
            <div class="saved-cart-item-container">
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
function updateSavedCartItemsVisibility() {
    if (calculateSavedCartItemsQuantity() > 0) {
        generateSavedCartItemsHTML();
    } else {
        generateEmptySavedCartItemsHTML();
    }
}

updateSavedCartItemsVisibility();
