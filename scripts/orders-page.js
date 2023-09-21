import { products } from '../data/products.js';
import { orders, saveToLocalStorage } from '../data/orders.js';

/* This function generates the HTML for each order in the `orders` array. It iterates 
through each order and concatenates the generated HTML to the `ordersHTML` variable.*/
function generateOrdersHTML() {
    let ordersHTML = '';

    orders.forEach((order) => {
        ordersHTML += `
            <div class="order-container-${order.id}">
                <div class="order-header">
                    <div class="order-header-left-section">
                        <div class="order-date">
                            <div class="order-header-label">
                                Order Placed:
                            </div>
                            <div>August 12</div>
                        </div>
                        <div class="order-total">
                            <div class="order-header-label">Total:</div>
                            <div>$35.06</div>
                        </div>
                    </div>

                    <div class="order-header-right-section">
                        <div class="order-header-label">Order ID:</div>
                        <div>27cba69d-4c3d-4098-b42d-ac7fa62b7664</div>
                    </div>
                </div>

                <!-- call the function to generate the order items HTML -->
                ${generateOrderItemsHTML(order)}
        </div>`;
    });

    // display the orders on the page
    const ordersGrid = document.querySelector('.orders-grid');
    if (ordersGrid) {
        ordersGrid.innerHTML = ordersHTML;
    }
}

// This function generates the HTML for order items
function generateOrderItemsHTML(order) {
    let orderItemsHTML = '';

    order.items.forEach((orderItem) => {
        // find and assign the matching product to access product details
        const productId = orderItem.productId;
        let matchingProduct;

        products.forEach((product) => {
            if (product.id === productId) {
                matchingProduct = product;
            }
        });

        orderItemsHTML += `
            <div class="order-details-grid">
                <div class="product-image-container">
                   <img src="${matchingProduct.image}">
                </div>

                <div class="product-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-delivery-date">
                        Arriving on: August 15
                    </div>
                    <div class="product-quantity">
                        Quantity: ${orderItem.quantity}
                    </div>
                    <button class="buy-again-button button-primary">
                        <img
                            class="buy-again-icon"
                            src="images/icons/buy-again.png"
                        />
                        <span class="buy-again-message"
                            >Buy it again</span
                        >
                    </button>
                </div>

                <div class="product-actions">
                        <button
                            class="cancel-order-button button-secondary"
                            data-order-id="${order.id}">
                                Cancel order
                        </button>
                </div>
            </div>`;
    });

    return orderItemsHTML;
}

generateOrdersHTML();

/**
 * This function generates a random order ID.
 * @returns the generated order ID.
 */
export function generateOrderId() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let orderId = '';

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        orderId += characters.charAt(randomIndex);
    }

    orderId += '-';

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            orderId += characters.charAt(randomIndex);
        }
        if (i < 3) {
            orderId += '-';
        }
    }

    return orderId;
}

/**
 * This function cancels an order based on the `orderId`, updates the orders array, 
 * and syncs the changes with the page.
 * @param orderId - The unique identifier of the order to be cancelled.
 */
function cancelOrder(orderId) {
    // find the index of the order with the specified ID
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    // if the order is found, remove it from the orders array
    if (orderIndex !== -1) {
        orders.splice(orderIndex, 1);
        saveToLocalStorage();

        // remove the order from the page
        const orderItemContainer = document.querySelector(
            `.order-container-${orderId}`
        );
        orderItemContainer.remove();
    }
}

// attach a click event listener to the "Cancel Order" button on the page
document.querySelectorAll('.cancel-order-button').forEach((button) => {
    button.addEventListener('click', () => {
        // get the order ID from the data attribute
        const orderId = button.dataset.orderId;

        cancelOrder(orderId);
    });
});
