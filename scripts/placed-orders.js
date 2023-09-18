import { orders } from '../data/orders.js';

/* This function generates the HTML for each order in the `orders` array. It iterates 
through each order and concatenates the generated HTML to the `ordersHTML` variable.*/
function generateOrdersHTML() {
    let ordersHTML = '';

    orders.forEach((order) => {
        ordersHTML += `
            <div class="order-container">
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
            </div>

            <!-- call the function to generate the order items HTML -->
            ${generateOrderItemsHTML(order.items)}

        </div>`;
    });

    // display the orders on the page
    document.querySelector('.orders-grid').innerHTML = ordersHTML;
}

// This function generates HTML for order items
function generateOrderItemsHTML(orderItems) {
    let orderItemsHTML = '';

    orderItems.forEach((orderItem) => {
        orderItemsHTML += `
            <div class="order-details-grid">
                <div class="product-image-container">
                    <img
                        ${orderItem.img}
                    />
                </div>

                <div class="product-details">
                    <div class="product-name">
                        ${orderItem.name}
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
                    <a href="tracking.html">
                        <button
                            class="track-package-button button-secondary"
                        >
                            Track package
                        </button>
                    </a>
                </div>
            </div>`;
    });

    return orderItemsHTML;
}

generateOrdersHTML();
