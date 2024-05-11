import { formatCurrency, findProductById } from "../../shared/utils.js";
import {
    wishList,
    addProductToCart,
    calculateQuantityOfWishListItems,
    updateWishListInLocalStorage,
} from '../../../data/checkout-page.js';
import {
    updateCartItemsQuantityDisplay,
    updateCartVisibility,
    updateCartItemDeliveryDateOptions,
    addEventListenersToDeliveryDateOptions,
} from '../checkout-page/cart.js';
import { updateOrderSummaryDisplay, updatePlaceOrderButtonVisibility } from '../checkout-page/order-summary.js';

const wishListContainer = document.querySelector('.wish-list-container');
const checkoutWishListContainer = document.querySelector('.checkout-wish-list-container');

function generateWishListHTML() {
    let wishListHTML = '';

    wishList.forEach((product) => {
        const matchingProduct = findProductById(product.productId);

        if (matchingProduct) {
            wishListHTML += `
                <div class="wish-list-item-container wish-list-item-container-${matchingProduct.id}">
                    <div class="wish-list-item-container-grid">
                        <img class="product-image" src="${matchingProduct.image}" alt="product image">
    
                        <div class="wish-list-item-details-container">
                            <div>
                                <div class="product-name">
                                    ${matchingProduct.name}
                                </div>
                                <div class="product-price">
                                    ${formatCurrency(matchingProduct.priceInCents)}
                                </div>
                            </div>
                            <div>
                                <span class="add-wish-list-item-to-cart-button link-primary" data-product-id="${
                matchingProduct.id
            }">
                                    Add to Cart
                                </span>
                                <span class="remove-wish-list-item-button link-primary" data-product-id="${
                matchingProduct.id
            }">
                                    Remove
                                </span>
                            </div>
                        </div>
                    </div>
                </div>`;
        } else {
            console.error('Matching product not found.');
        }
    });

    if (wishListContainer) {
        wishListContainer.innerHTML = wishListHTML;
    }
}

function generateCheckoutWishListHTML() {
    let checkoutWishListHTML = '';

    wishList.forEach((product) => {
        const matchingProduct = findProductById(product.productId);

        if (matchingProduct) {
            checkoutWishListHTML += `
                <div class="checkout-wish-list-item-container checkout-wish-list-item-container-${matchingProduct.id}">
                    <div class="checkout-wish-list-item-container-grid">
                        <img class="product-image" src="${matchingProduct.image}" alt="product image">
    
                        <div class="checkout-wish-list-item-details-container">
                            <div>
                                <div class="product-name">
                                    ${matchingProduct.name}
                                </div>
                                <div class="product-price">
                                    ${formatCurrency(matchingProduct.priceInCents)}
                                </div>
                            </div>
                            <div>
                                <span class="add-wish-list-item-to-cart-button link-primary" data-product-id="${
                matchingProduct.id
            }">
                                    Add to Cart
                                </span>
                                <span class="remove-wish-list-item-button link-primary" data-product-id="${
                matchingProduct.id
            }">
                                    Remove
                                </span>
                            </div>
                        </div>
                    </div>
                </div>`;
        }  else {
            console.error('Matching product not found.');
        }
    });

    if (checkoutWishListContainer) {
        checkoutWishListContainer.innerHTML = checkoutWishListHTML;
    }
}

function generateEmptyWishListHTML() {
    if (wishListContainer) {
        wishListContainer.innerHTML = `
           <div class="empty-wish-list-container">
               <div class="empty-wish-list-message-container">
                   <div>
                       <span>Looks like it's empty!</span><br><br>
                       Why not add something?
                   </div>
                   <div>
                       Continue shopping on the
                       <a class="link-primary" href="index.html">homepage</a>.
                   </div>
               </div>
               <i class="bi bi-bookmark-x" id="emptyWishListContainerImg"></i>
           </div>
       `;
    }
}


function generateEmptyCheckoutWishListHTML() {
    if (checkoutWishListContainer) {
        checkoutWishListContainer.innerHTML = `
       <div class="empty-checkout-wish-list-container">
           <div class="empty-checkout-wish-list-message-container">
               <div>
                   <span>Looks like it's empty!</span><br><br>
                   Why not add something?
               </div>
           </div>
           <i class="bi bi-bookmark-x" id="emptyWishListContainerImg"></i>
       </div>
   `;
    }
}

/**
 * Updates the visibility of the wish list based on the quantity of wish list items.
 * - If the wish list is not empty, HTML for the wish list items is generated.
 * - If the wish list is empty, HTML for an empty wish list is generated.
 */
export function updateWishListVisibility() {
    const wishListQuantity = calculateQuantityOfWishListItems();

    if (wishListQuantity > 0) {
        generateWishListHTML();
        generateCheckoutWishListHTML();
    } else {
        generateEmptyWishListHTML();
        generateEmptyCheckoutWishListHTML();
    }
}

updateWishListVisibility();


/**
 * Handles the "add with list item to cart" button click event.
 * - If the button is clicked, the product is added to the cart and is removed from the wish list.
 */
function handleAddWishListItemToCartButtonClick (event) {
    const addWishListItemToCartButton = event.target.closest('.add-wish-list-item-to-cart-button');

    if (addWishListItemToCartButton) {
        const productId = addWishListItemToCartButton.dataset.productId;
        addProductToCart(productId, 1);
        removeWishListItem(productId);
        updateCartVisibility();
        updateCartItemDeliveryDateOptions();
        addEventListenersToDeliveryDateOptions();
        updateWishListVisibility();
        updateCartItemsQuantityDisplay();
        updateOrderSummaryDisplay();
        updatePlaceOrderButtonVisibility();
    }
}

if (wishListContainer) {
    wishListContainer.addEventListener('click', handleAddWishListItemToCartButtonClick);
}
if (checkoutWishListContainer) {
    checkoutWishListContainer.addEventListener('click', handleAddWishListItemToCartButtonClick);
}

/**
 * Removes a product from the wish list.
 * @param {string} productId - The unique identifier of the wish list item.
 */
export function removeWishListItem(productId) {
    const itemIndex = wishList.findIndex((product) => product.productId === productId);
    const productContainer = document.querySelector(`.checkout-wish-list-item-container-${productId}`);

    if (itemIndex !== -1) {
        wishList.splice(itemIndex, 1);
    }
    if (productContainer) {
        productContainer.remove();
    }

    updateWishListInLocalStorage();
}

/**
 * Handles the "remove wish list item" click event.
 * - If the button is clicked, the product is removed from the wish list and UI displays are updated.
 */
function handleRemoveWishListItemButtonClick(event) {
    const removeButton = event.target.closest('.remove-wish-list-item-button');

    if (removeButton) {
        const productId = removeButton.dataset.productId;
        removeWishListItem(productId);
        updateWishListVisibility();
    }
}

if (wishListContainer) {
    wishListContainer.addEventListener('click', handleRemoveWishListItemButtonClick);
}
if (checkoutWishListContainer) {
    checkoutWishListContainer.addEventListener('click', handleRemoveWishListItemButtonClick);
}
