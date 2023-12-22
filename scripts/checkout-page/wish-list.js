import { products } from '../../data/home-page.js';
import { formatCurrency } from '../utils/format-currency.js';
import {
    wishList,
    addProductToCart,
    calculateWishListQuantity,
    updateWishListInLocalStorage,
} from '../../data/checkout-page.js';
import {
    updateCartQuantityDisplay,
    updateCartVisibility,
    updateDeliveryDateOptions,
    addEventListenersToDeliveryDateOptions,
} from './cart.js';
import { updateOrderSummaryDisplay, updatePlaceOrderButtonVisibility } from './order-summary.js';
const wishListContainer = document.querySelector('.wish-list-container');

/**
 * Finds a product in the products array based on its ID.
 * @param {string} productId - The ID of the product to find.
 * @returns {Object | undefined} - The matching product or undefined if not found.
 */
function findProductById(productId) {
    return products.find((product) => product.id === productId);
}

function generateWishListHTML() {
    let wishListHTML = '';

    wishList.forEach((product) => {
        const matchingProduct = findProductById(product.productId);

        if (matchingProduct) {
            wishListHTML += `
                <div class="wish-list-product-container ${`wish-list-product-container-${matchingProduct.id}`}">
                    <div class="wish-list-product-container-grid">
                        <img class="product-image" src="${matchingProduct.image}">
    
                        <div class="wish-list-product-details-container">
                            <div>
                                <div class="product-name">
                                    ${matchingProduct.name}
                                </div>
                                <div class="product-price">
                                    ${formatCurrency(matchingProduct.priceInCents)}
                                </div>
                            </div>
                            <div>
                                <span class="add-wish-list-product-to-cart-button link-primary" data-product-id="${
                                    matchingProduct.id
                                }">
                                    Add to Cart
                                </span>
                                <span class="remove-wish-list-product-button link-primary" data-product-id="${
                                    matchingProduct.id
                                }">
                                    Remove
                                </span>
                            </div>
                        </div>
                    </div>
                </div>`;
        }
    });

    wishListContainer.innerHTML = wishListHTML;
}

function generateEmptyWishListHTML() {
    wishListContainer.innerHTML = `
        <div class="empty-wish-list-container">
            <div class="empty-wish-list-message-container">
                <div>
                    <span>Looks like it's empty!</span><br><br>
                    Why not add something?
                </div>
            </div>
            <img class="empty-wish-list-container-img" src="images/icons/save.png">
        </div>
    `;
}

/**
 * Updates the visibility of the wish list based on the quantity of wish list products.
 */
export function updateWishListVisibility() {
    const wishListQuantity = calculateWishListQuantity();
    wishListQuantity > 0 ? generateWishListHTML() : generateEmptyWishListHTML();
}

updateWishListVisibility();

/**
 * Attaches a click event listener to the element that holds all "Add Wish List Item To Cart"
 * buttons using event delegation. If a button is clicked, the code gets the 'productId',
 * adds the product to the cart, and removes the product from the wish list.
 */
document.querySelector('.wish-list-container').addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-wish-list-product-to-cart-button');

    if (addButton) {
        const productId = addButton.dataset.productId;

        addProductToCart(productId, 1);
        removeWishListProduct(productId);
        updateCartVisibility();
        updateDeliveryDateOptions();
        addEventListenersToDeliveryDateOptions();
        updateWishListVisibility();
        updateCartQuantityDisplay();
        updateOrderSummaryDisplay();
        updatePlaceOrderButtonVisibility();
    }
});

/**
 * Removes a product from the wish list if found in the 'wish list' array using the 'productId'.
 * @param productId - The unique identifier of the product to be removed.
 */
function removeWishListProduct(productId) {
    const productIndex = wishList.findIndex((product) => product.productId === productId);

    if (productIndex !== -1) {
        wishList.splice(productIndex, 1);
    }

    const productContainer = document.querySelector(`.wish-list-product-container-${productId}`);

    if (productContainer) {
        productContainer.remove();
    }

    updateWishListInLocalStorage();
}

/**
 * Attaches a click event listener to the element that holds all "Remove Wish List Item"
 * buttons using event delegation. If a button is clicked, the code gets the 'productId',
 * removes the product from the wish list, and updates displays.
 */
document.querySelector('.wish-list-container').addEventListener('click', (event) => {
    const removeButton = event.target.closest('.remove-wish-list-product-button');

    if (removeButton) {
        const productId = removeButton.dataset.productId;

        removeWishListProduct(productId);
        updateWishListVisibility();
    }
});
