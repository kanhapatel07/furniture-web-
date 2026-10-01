

// ======================================================
// ORDER API
// ======================================================

const ORDER_API =
    // "http://192.168.29.93:3002/api/orders";
    "http://192.168.29.157:3002/api/order";


// ======================================================
// PAGINATION
// ======================================================

let currentOrderPage = 1;

const ordersPerPage = 5;

let totalOrderPages = 1;


// ======================================================
// CURRENT ORDERS
// ======================================================

let currentOrders = [];


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadOrders(1);

    }
);


// ======================================================
// GET ALL ORDERS
// ======================================================

async function loadOrders(page = 1) {

    const orderTable =
        document.getElementById(
            "orderTable"
        );


    if (!orderTable) {

        console.error(
            "orderTable element nahi mila"
        );

        return;

    }


    // ==================================================
    // CURRENT PAGE
    // ==================================================

    currentOrderPage =
        Number(page);


    // ==================================================
    // LOADING
    // ==================================================

    orderTable.innerHTML = `
        <tr>
            <td
                colspan="7"
                style="text-align:center;"
            >
                Loading orders...
            </td>
        </tr>
    `;


    try {

        // ==================================================
        // TOKEN
        // ==================================================

        const token =
            localStorage.getItem(
                "token"
            );


        const headers = {

            "Accept":
                "application/json"

        };


        if (token) {

            headers["Authorization"] =
                `Bearer ${token}`;

        }


        // ==================================================
        // API CALL
        // ==================================================

        const response =
            await fetch(
                `${ORDER_API}?page=${currentOrderPage}&limit=${ordersPerPage}&_t=${Date.now()}`,
                {
                    method: "GET",

                    headers: headers,

                    cache: "no-store"
                }
            );


        console.log(
            "Order API URL:",
            `${ORDER_API}?page=${currentOrderPage}&limit=${ordersPerPage}`
        );


        console.log(
            "Order API Status:",
            response.status
        );


        // ==================================================
        // API ERROR
        // ==================================================

        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Order API Error:",
                errorText
            );


            throw new Error(
                `Order API Error: ${response.status}`
            );

        }


        // ==================================================
        // RESPONSE
        // ==================================================

        const result =
            await response.json();


        console.log(
            "Order API Response:",
            result
        );


        // ==================================================
        // RESPONSE HANDLE
        // ==================================================

        let orders = [];


        if (
            Array.isArray(result)
        ) {

            orders =
                result;

        }

        else if (
            result &&
            Array.isArray(result.data)
        ) {

            orders =
                result.data;

        }

        else if (
            result &&
            Array.isArray(result.orders)
        ) {

            orders =
                result.orders;

        }

        else if (
            result &&
            result.data &&
            Array.isArray(
                result.data.orders
            )
        ) {

            orders =
                result.data.orders;

        }

        else if (
            result &&
            result.data &&
            Array.isArray(
                result.data.data
            )
        ) {

            orders =
                result.data.data;

        }


        console.log(
            "ALL ORDERS FROM API:",
            orders
        );


        // ==================================================
        // SAVE ORDERS
        // ==================================================

        currentOrders =
            orders;


        // ==================================================
        // PAGINATION DATA
        // ==================================================

        const pagination =
            result.pagination ||
            result.meta ||
            result.data?.pagination ||
            {};


        console.log(
            "API PAGINATION:",
            pagination
        );


        // ==================================================
        // GET TOTAL ORDERS
        // ==================================================

        let totalOrdersCount =
            Number(
                pagination.total ||
                pagination.totalItems ||
                pagination.count ||
                result.total ||
                result.totalItems ||
                result.count ||
                result.data?.total ||
                result.data?.totalItems ||
                0
            );


        // ==================================================
        // IMPORTANT
        // ==================================================

        if (
            !totalOrdersCount
        ) {

            totalOrdersCount =
                orders.length;

        }


        // ==================================================
        // TOTAL PAGES
        // ==================================================

        totalOrderPages =
            Math.ceil(
                totalOrdersCount /
                ordersPerPage
            );


        if (
            totalOrderPages < 1
        ) {

            totalOrderPages =
                1;

        }


        // ==================================================
        // FRONTEND PAGINATION
        // ==================================================

        const startIndex =
            (
                currentOrderPage - 1
            ) *
            ordersPerPage;


        const endIndex =
            startIndex +
            ordersPerPage;


        // ==================================================
        // ONLY CURRENT PAGE ORDERS
        // ==================================================

        const currentPageOrders =
            orders.slice(
                startIndex,
                endIndex
            );


        console.log(
            "CURRENT PAGE ORDERS:",
            currentPageOrders
        );


        console.log(
            "CURRENT PAGE:",
            currentOrderPage
        );


        console.log(
            "TOTAL ORDERS:",
            totalOrdersCount
        );


        console.log(
            "TOTAL PAGES:",
            totalOrderPages
        );


        // ==================================================
        // DASHBOARD TOTAL ORDERS
        // ==================================================

        const totalOrders =
            document.getElementById(
                "totalOrders"
            );


        if (totalOrders) {

            totalOrders.textContent =
                totalOrdersCount;

        }


        // ==================================================
        // CREATE PAGINATION
        // ==================================================

        createOrderPagination(
            totalOrderPages
        );


        // ==================================================
        // DISPLAY ONLY CURRENT PAGE
        // ==================================================

        displayOrders(
            currentPageOrders
        );

    }

    catch (error) {

        console.error(
            "Load Orders Error:",
            error
        );


        orderTable.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        color:red;
                    "
                >

                    Failed to load orders

                    <br>

                    <small>
                        ${escapeHTML(
            error.message
        )}
                    </small>

                    <br><br>

                    <button
                        type="button"
                        class="btn btn-sm"
                        onclick="loadOrders(${currentOrderPage})"
                    >
                        Try Again
                    </button>

                </td>
            </tr>
        `;


        hideOrderPagination();

    }

}


// ======================================================
// DISPLAY ORDERS
// ======================================================

function displayOrders(orders) {

    const orderTable =
        document.getElementById(
            "orderTable"
        );


    if (!orderTable) {

        return;

    }


    // ==================================================
    // NO ORDERS
    // ==================================================

    if (
        !orders ||
        orders.length === 0
    ) {

        orderTable.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center;"
                >
                    No Orders Found
                </td>
            </tr>
        `;

        return;

    }


    orderTable.innerHTML = "";


    orders.forEach(
        function (order) {


            // ==================================================
            // ORDER ID
            // ==================================================

            const orderId =
                order.id ??
                order.orderId ??
                order._id ??
                "-";


            // ==================================================
            // CUSTOMER PHONE
            // ==================================================

            const customerPhone =
                order.phone ??
                order.customerPhone ??
                order.customer?.phone ??
                "-";


            // ==================================================
            // ADDRESS
            // ==================================================

            const address =
                order.address ??
                order.customer?.address ??
                "-";


            // ==================================================
            // TOTAL
            // ==================================================
                const total = Number(
                    order.total ??
                    order.totalPrice ??
                    order.totalAmount ??
                    order.amount ??
                    order.grandTotal ??
                    order.total_price ??
                    order.total_amount ??
                    0
                );

            // ==================================================
            // DATE
            // ==================================================

            const rawDate =
                order.created_at ??
                order.createdAt ??
                order.date ??
                order.orderDate ??
                null;


            let orderDate = "-";


            if (rawDate) {

                const date = new Date(rawDate);

                if (!isNaN(date.getTime())) {

                    orderDate = date.toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }
                    );

                } else {

                    orderDate = rawDate;

                }

            }

            // ==================================================
            // CURRENT STATUS
            // ==================================================

            const status =
                order.status ??
                order.orderStatus ??
                "PENDING";


            const currentStatus =
                String(
                    status
                ).toUpperCase();


            // ==================================================
            // ORDER ID FOR INLINE FUNCTION
            // ==================================================

            const safeOrderId =
                String(orderId)
                    .replace(
                        /\\/g,
                        "\\\\"
                    )
                    .replace(
                        /'/g,
                        "\\'"
                    );

                    


            // ==================================================
            // TABLE ROW
            // ==================================================

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <!-- ORDER ID -->

                <td>
                    ${escapeHTML(orderId)}
                </td>


                <!-- CUSTOMER PHONE -->

                <td>
                    ${escapeHTML(customerPhone)}
                </td>


                <!-- ADDRESS -->

                <td>
                    ${escapeHTML(address)}
                </td>


                <!-- TOTAL -->

                <td>
                    ₹${Number(total).toLocaleString("en-IN")}
                </td>


                <!-- DATE -->

                <td>
                    ${escapeHTML(orderDate)}
                </td>


                <!-- CURRENT STATUS -->

                <td>

                    <span
                        class="order-status ${currentStatus.toLowerCase()}"
                    >
                        ${escapeHTML(currentStatus)}
                    </span>

                </td>


                <!-- ACTION -->
           

            <td>

                <div
                    class="order-action"
                    style="
                        display:flex;
                        flex-direction:column;
                        align-items:flex-start;
                        gap:8px;
                        padding:0;
                    "
                >

                    <!-- STATUS -->

                    <select
                        class="order-status-select"
                        id="status-${escapeHTML(orderId)}"
                    >

                        <option
                            value="PENDING"
                            ${currentStatus === "PENDING"
                    ? "selected"
                    : ""
                }
                        >
                            PENDING
                        </option>


                        <option
                            value="PROCESSING"
                            ${currentStatus === "PROCESSING"
                    ? "selected"
                    : ""
                }
                        >
                            PROCESSING
                        </option>


                        <option
                            value="SHIPPED"
                            ${currentStatus === "SHIPPED"
                    ? "selected"
                    : ""
                }
                        >
                            SHIPPED
                        </option>


                        <option
                            value="DELIVERED"
                            ${currentStatus === "DELIVERED"
                    ? "selected"
                    : ""
                }
                        >
                            DELIVERED
                        </option>


                        <option
                            value="CANCELLED"
                            ${currentStatus === "CANCELLED"
                    ? "selected"
                    : ""
                }
                        >
                            CANCELLED
                        </option>

                    </select>


                    <!-- VIEW + UPDATE BUTTONS -->

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:10px;
                            width:100%;
                        "
                    >

                        <!-- VIEW BUTTON -->

                        <button
                            type="button"
                            class="view-order-btn"
                            onclick="viewOrder('${safeOrderId}')"
                        >
                            View
                        </button>


                        <!-- UPDATE BUTTON -->

                        <button
                            type="button"
                            class="update-status-btn"
                            onclick="changeOrderStatus('${safeOrderId}')"
                        >
                            Update
                        </button>

                    </div>

                </div>

            </td>
             

            `;


            orderTable.appendChild(
                row
            );

        }
    );

}


// ======================================================
// VIEW ORDER
// ======================================================

async function viewOrder(orderId) {

    console.log(
        "VIEW ORDER ID:",
        orderId
    );


    // ==================================================
    // SHOW LOADING MODAL
    // ==================================================

    showViewLoading();


    try {

        // ==================================================
        // TOKEN
        // ==================================================

        const token =
            localStorage.getItem(
                "token"
            );


        const headers = {

            "Accept":
                "application/json"

        };


        if (token) {

            headers["Authorization"] =
                `Bearer ${token}`;

        }


        // ==================================================
        // GET SINGLE ORDER
        // ==================================================

        const response =
            await fetch(
                `${ORDER_API}/${encodeURIComponent(orderId)}`,
                {
                    method: "GET",

                    headers: headers,

                    cache: "no-store"
                }
            );


        console.log(
            "VIEW ORDER STATUS:",
            response.status
        );


        // ==================================================
        // READ RESPONSE
        // ==================================================

        const result =
            await response.json();


        console.log(
            "VIEW ORDER RESPONSE:",
            result
        );


        // ==================================================
        // ERROR
        // ==================================================

        if (!response.ok) {

            throw new Error(
                result.message ||
                result.error ||
                `Order detail failed: ${response.status}`
            );

        }


        // ==================================================
        // GET ORDER OBJECT
        // ==================================================

        let order =
            result;


        if (
            result.data
        ) {

            order =
                result.data;

        }


        if (
            result.order
        ) {

            order =
                result.order;

        }


        console.log(
            "FINAL ORDER:",
            order
        );


        // ==================================================
        // SHOW DETAILS
        // ==================================================

        showOrderDetails(
            order
        );

    }

    catch (error) {

        console.error(
            "VIEW ORDER ERROR:",
            error
        );


        closeOrderModal();


        alert(
            "Order details load nahi ho sake.\n\n" +
            error.message
        );

    }

}


// ======================================================
// SHOW LOADING
// ======================================================

function showViewLoading() {

    closeOrderModal();


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "orderViewModal";


    modal.innerHTML = `

        <div
            style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,0.6);
                z-index:99999;
                display:flex;
                align-items:center;
                justify-content:center;
            "
        >

            <div
                style="
                    background:white;
                    padding:30px;
                    border-radius:10px;
                    text-align:center;
                "
            >

                <strong>
                    Loading order details...
                </strong>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


// ======================================================
// SHOW ORDER DETAILS
// ======================================================

function showOrderDetails(order) {

    closeOrderModal();


    // ==================================================
    // ORDER INFORMATION
    // ==================================================

    const orderId =
        order.id ??
        order.orderId ??
        order._id ??
        "-";


    const customerPhone =
        order.phone ??
        order.customerPhone ??
        order.customer?.phone ??
        "-";


    const address =
        order.address ??
        order.customer?.address ??
        "-";


    const total =
        Number(
            order.total ??
            order.totalAmount ??
            order.amount ??
            0
        );


    const status =
        order.status ??
        order.orderStatus ??
        "PENDING";


    // ==================================================
    // DATE
    // ==================================================

    const rawDate =
        order.createdAt ??
        order.date ??
        order.orderDate ??
        null;


    let orderDate = "-";


    if (rawDate) {

        const date =
            new Date(
                rawDate
            );


        if (
            !isNaN(
                date.getTime()
            )
        ) {

            orderDate =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    }
                );

        }

    }


    // ==================================================
    // PRODUCTS
    // ==================================================

    let products =
        order.products ??
        order.items ??
        order.orderItems ??
        order.cartItems ??
        order.order_products ??
        [];


    if (
        !Array.isArray(products)
    ) {

        products = [];

    }


    console.log(
        "PRODUCTS:",
        products
    );


    // ==================================================
    // PRODUCTS HTML
    // ==================================================

    let productsHTML = "";


    if (
        products.length === 0
    ) {

        productsHTML = `

            <div
                style="
                    border:1px solid #ddd;
                    padding:25px;
                    text-align:center;
                    border-radius:8px;
                    color:#777;
                "
            >
                No product details found
            </div>

        `;

    }

    else {

        productsHTML =
            products.map(
                function (item, index) {

                    // ==========================================
                    // PRODUCT
                    // ==========================================

                    const product =
                        item.product ??
                        item.productDetails ??
                        item;


                    // ==========================================
                    // NAME
                    // ==========================================

                    const productName =
                        product.name ??
                        product.productName ??
                        item.name ??
                        item.productName ??
                        `Product ${index + 1}`;


                    // ==========================================
                    // IMAGE
                    // ==========================================

                    // const productImage =
                    //     product.productUrl ??
                    //     product.productImage ??
                    //     product.image ??
                    //     product.imageUrl ??
                    //     product.url ??
                    //     item.productUrl ??
                    //     item.productImage ??
                    //     item.image ??
                    //     item.imageUrl ??
                    //     "";

                    const productImage =
                        product.product_image ??
                        product.productUrl ??
                        product.productImage ??
                        product.image ??
                        product.imageUrl ??
                        product.url ??
                        item.product_image ??
                        item.productUrl ??
                        item.productImage ??
                        item.image ??
                        item.imageUrl ??
                        "";


                    const imageURL =
                        getOrderProductImage(
                            productImage
                        );


                    // ==========================================
                    // PRICE
                    // ==========================================

                    const price =
                        Number(
                            item.price ??
                            item.productPrice ??
                            product.price ??
                            0
                        );


                    // ==========================================
                    // QUANTITY
                    // ==========================================

                    const quantity =
                        Number(
                            item.quantity ??
                            item.qty ??
                            1
                        );


                    // ==========================================
                    // SUBTOTAL
                    // ==========================================

                    const subtotal =
                        price *
                        quantity;


                    return `

                        <div
                            style="
                                display:flex;
                                align-items:center;
                                gap:15px;
                                border:1px solid #ddd;
                                border-radius:10px;
                                padding:15px;
                                margin-bottom:12px;
                            "
                        >

                            <!-- PRODUCT IMAGE -->

                            <div
                                style="
                                    width:90px;
                                    height:90px;
                                    min-width:90px;
                                    border:1px solid #ddd;
                                    border-radius:8px;
                                    overflow:hidden;
                                    background:#f5f5f5;
                                "
                            >

                                <img
                                    src="${escapeHTML(imageURL)}"
                                    alt="${escapeHTML(productName)}"
                                    style="
                                        width:100%;
                                        height:100%;
                                        object-fit:cover;
                                    "
                                    onerror="
                                        this.onerror=null;
                                        this.src='images/product.svg';
                                    "
                                >

                            </div>


                            <!-- PRODUCT DETAILS -->

                            <div
                                style="
                                    flex:1;
                                "
                            >

                                <h4
                                    style="
                                        margin:0 0 8px;
                                    "
                                >
                                    ${escapeHTML(productName)}
                                </h4>


                                <div
                                    style="
                                        margin:4px 0;
                                        color:#555;
                                    "
                                >
                                    Price:
                                    ₹${price.toLocaleString("en-IN")}
                                </div>


                                <div
                                    style="
                                        margin:4px 0;
                                        color:#555;
                                    "
                                >
                                    Quantity:
                                    ${quantity}
                                </div>


                                <strong
                                    style="
                                        display:block;
                                        margin-top:6px;
                                    "
                                >
                                    Subtotal:
                                    ₹${subtotal.toLocaleString("en-IN")}
                                </strong>

                            </div>

                        </div>

                    `;

                }
            ).join("");

    }


    // ==================================================
    // CREATE MODAL
    // ==================================================

    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "orderViewModal";


    modal.innerHTML = `

        <div
            class="order-view-overlay"
            style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,0.6);
                z-index:99999;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
            "
            onclick="closeOrderModal(event)"
        >

            <div
                class="order-view-box"
                style="
                    width:100%;
                    max-width:850px;
                    max-height:90vh;
                    overflow-y:auto;
                    background:#fff;
                    border-radius:12px;
                    padding:25px;
                    box-sizing:border-box;
                    box-shadow:0 10px 40px rgba(0,0,0,0.3);
                "
                onclick="event.stopPropagation()"
            >

                <!-- HEADER -->

                <div
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        border-bottom:1px solid #ddd;
                        padding-bottom:15px;
                        margin-bottom:20px;
                    "
                >

                    <h2
                        style="
                            margin:0;
                        "
                    >
                        Order Details
                    </h2>


                    <button
                        type="button"
                        onclick="closeOrderModal()"
                        style="
                            border:none;
                            background:none;
                            font-size:28px;
                            cursor:pointer;
                        "
                    >
                        &times;
                    </button>

                </div>


                <!-- ORDER INFO -->

                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(200px,1fr)
                            );
                        gap:15px;
                        margin-bottom:25px;
                    "
                >

                    <div>

                        <strong>
                            Order ID
                        </strong>

                        <br>

                        ${escapeHTML(orderId)}

                    </div>


                    <div>

                        <strong>
                            Customer Phone
                        </strong>

                        <br>

                        ${escapeHTML(customerPhone)}

                    </div>


                    <div>

                        <strong>
                            Order Date
                        </strong>

                        <br>

                        ${escapeHTML(orderDate)}

                    </div>


                    <div>

                        <strong>
                            Status
                        </strong>

                        <br>

                        <span
                            class="order-status ${String(status).toLowerCase()}"
                        >
                            ${escapeHTML(
        String(status).toUpperCase()
    )}
                        </span>

                    </div>


                    <div
                        style="
                            grid-column:1 / -1;
                        "
                    >

                        <strong>
                            Address
                        </strong>

                        <br>

                        ${escapeHTML(address)}

                    </div>


                    <div>

                        <strong>
                            Total
                        </strong>

                        <br>

                        ₹${total.toLocaleString("en-IN")}

                    </div>

                </div>


                <!-- PRODUCTS TITLE -->

                <h3
                    style="
                        margin-bottom:15px;
                    "
                >
                    Order Products
                </h3>


                <!-- PRODUCTS -->

                <div>

                    ${productsHTML}

                </div>


                <!-- FOOTER -->

                <div
                    style="
                        text-align:right;
                        border-top:1px solid #ddd;
                        padding-top:15px;
                        margin-top:20px;
                    "
                >

                    <button
                        type="button"
                        onclick="closeOrderModal()"
                        style="
                            padding:10px 20px;
                            border:none;
                            border-radius:6px;
                            cursor:pointer;
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


// ======================================================
// PRODUCT IMAGE URL
// ======================================================

function getOrderProductImage(
    image
) {

    if (
        !image
    ) {

        return "images/product.svg";

    }


    image =
        String(image).trim();


    // ==================================================
    // FULL URL
    // ==================================================

    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("data:") ||
        image.startsWith("blob:")
    ) {

        return image;

    }


    // ==================================================
    // API BASE URL
    // ==================================================

    const API_BASE_URL =
        "http://192.168.29.157:3002";

    // ==================================================
    // /uploads/...
    // ==================================================

    if (
        image.startsWith("/")
    ) {

        return (
            API_BASE_URL +
            image
        );

    }


    // ==================================================
    // uploads/...
    // ==================================================

    return (
        API_BASE_URL +
        "/" +
        image
    );

}


// ======================================================
// CLOSE ORDER MODAL
// ======================================================

function closeOrderModal(
    event
) {

    // Outside click

    if (
        event &&
        event.target &&
        event.currentTarget &&
        event.target !==
        event.currentTarget
    ) {

        return;

    }


    const modal =
        document.getElementById(
            "orderViewModal"
        );


    if (modal) {

        modal.remove();

    }

}


// ======================================================
// CREATE ORDER PAGINATION
// ======================================================

function createOrderPagination(
    totalPages
) {

    const paginationNumbers =
        document.getElementById(
            "paginationNumbers"
        );


    const prevPage =
        document.getElementById(
            "prevPage"
        );


    const nextPage =
        document.getElementById(
            "nextPage"
        );


    if (!paginationNumbers) {

        console.warn(
            "paginationNumbers element nahi mila"
        );

        return;

    }


    // ==================================================
    // CLEAR OLD PAGINATION
    // ==================================================

    paginationNumbers.innerHTML =
        "";


    // ==================================================
    // VALIDATE
    // ==================================================

    totalPages =
        Number(totalPages);


    if (
        totalPages < 1
    ) {

        totalPages =
            1;

    }


    // ==================================================
    // WRAPPER
    // ==================================================

    const pageWrapper =
        document.createElement(
            "div"
        );


    pageWrapper.style.display =
        "flex";


    pageWrapper.style.alignItems =
        "center";


    pageWrapper.style.justifyContent =
        "center";


    pageWrapper.style.gap =
        "8px";


    // ==================================================
    // CURRENT PAGE BOX
    // ==================================================

    const currentPageBox =
        document.createElement(
            "span"
        );


    currentPageBox.className =
        "pagination-page-box";


    currentPageBox.textContent =
        currentOrderPage;


    // ==================================================
    // TO
    // ==================================================

    const toText =
        document.createElement(
            "span"
        );


    toText.className =
        "pagination-to-text";


    toText.textContent =
        "To";


    // ==================================================
    // TOTAL PAGE BOX
    // ==================================================

    const totalPageBox =
        document.createElement(
            "span"
        );


    totalPageBox.className =
        "pagination-page-box";


    totalPageBox.textContent =
        totalPages;


    // ==================================================
    // ADD
    // ==================================================

    pageWrapper.appendChild(
        currentPageBox
    );


    pageWrapper.appendChild(
        toText
    );


    pageWrapper.appendChild(
        totalPageBox
    );


    paginationNumbers.appendChild(
        pageWrapper
    );


    // ==================================================
    // PREVIOUS
    // ==================================================

    if (prevPage) {

        prevPage.style.display =
            "flex";


        prevPage.disabled =
            currentOrderPage <= 1;


        prevPage.onclick =
            function () {

                if (
                    currentOrderPage > 1
                ) {

                    loadOrders(
                        currentOrderPage - 1
                    );

                }

            };

    }


    // ==================================================
    // NEXT
    // ==================================================

    if (nextPage) {

        nextPage.style.display =
            "flex";


        nextPage.disabled =
            currentOrderPage >=
            totalPages;


        nextPage.onclick =
            function () {

                if (
                    currentOrderPage <
                    totalPages
                ) {

                    loadOrders(
                        currentOrderPage + 1
                    );

                }

            };

    }


    // ==================================================
    // ONLY ONE PAGE
    // ==================================================

    if (
        totalPages <= 1
    ) {

        if (prevPage) {

            prevPage.style.display =
                "none";

        }


        if (nextPage) {

            nextPage.style.display =
                "none";

        }

    }

}


// ======================================================
// HIDE PAGINATION
// ======================================================

function hideOrderPagination() {

    const paginationNumbers =
        document.getElementById(
            "paginationNumbers"
        );


    const prevPage =
        document.getElementById(
            "prevPage"
        );


    const nextPage =
        document.getElementById(
            "nextPage"
        );


    if (paginationNumbers) {

        paginationNumbers.innerHTML =
            "";

    }


    if (prevPage) {

        prevPage.style.display =
            "none";

    }


    if (nextPage) {

        nextPage.style.display =
            "none";

    }

}


// ======================================================
// CHANGE ORDER STATUS
// ======================================================

function changeOrderStatus(
    orderId
) {

    const select =
        document.getElementById(
            `status-${orderId}`
        );


    if (!select) {

        alert(
            "Status dropdown nahi mila."
        );

        return;

    }


    const status =
        select.value;


    updateOrderStatus(
        orderId,
        status
    );

}


// ======================================================
// UPDATE ORDER STATUS API
// ======================================================

async function updateOrderStatus(
    orderId,
    status
) {

    const allowedStatuses = [

        "PENDING",

        "PROCESSING",

        "SHIPPED",

        "DELIVERED",

        "CANCELLED"

    ];


    if (
        !allowedStatuses.includes(
            status
        )
    ) {

        alert(
            "Invalid order status."
        );

        return;

    }


    try {

        // ==================================================
        // TOKEN
        // ==================================================

        const token =
            localStorage.getItem(
                "token"
            );


        const headers = {

            "Content-Type":
                "application/json",

            "Accept":
                "application/json"

        };


        if (token) {

            headers["Authorization"] =
                `Bearer ${token}`;

        }


        // ==================================================
        // STATUS API
        // ==================================================

        const statusAPI =
            `${ORDER_API}/${orderId}/status`;


        console.log(
            "Updating Order Status:",
            statusAPI
        );


        console.log(
            "Status:",
            status
        );


        // ==================================================
        // PUT
        // ==================================================

        const response =
            await fetch(
                statusAPI,
                {

                    method:
                        "PUT",

                    headers:
                        headers,

                    body:
                        JSON.stringify({
                            status:
                                status
                        })

                }
            );


        // ==================================================
        // RESPONSE
        // ==================================================

        const result =
            await response
                .json()
                .catch(
                    () => ({})
                );


        console.log(
            "Status Update Response:",
            result
        );


        // ==================================================
        // ERROR
        // ==================================================

        if (
            !response.ok
        ) {

            throw new Error(
                result.message ||
                result.error ||
                `Status update failed: ${response.status}`
            );

        }


        // ==================================================
        // SUCCESS
        // ==================================================

        alert(
            `Order status updated to ${status}`
        );


        // ==================================================
        // REFRESH CURRENT PAGE
        // ==================================================

        loadOrders(
            currentOrderPage
        );


    }

    catch (error) {

        console.error(
            "Update Order Status Error:",
            error
        );


        alert(
            "Order status update nahi ho paya.\n\n" +
            error.message
        );

    }

}


// ======================================================
// HTML ESCAPE
// ======================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}