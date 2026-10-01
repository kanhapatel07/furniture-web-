// ======================================================
// CART PAGE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCartPage();

    }
);


// ======================================================
// LOAD CART
// ======================================================

async function loadCartPage() {

    const tableBody =
        document.getElementById(
            "cartTableBody"
        );


    if (!tableBody) {

        return;

    }


    try {

        const cartItems =
            await getCart();


        console.log(
            "CART ITEMS:",
            cartItems
        );


        // ==============================================
        // EMPTY CART
        // ==============================================

        if (
            !cartItems ||
            cartItems.length === 0
        ) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="text-center"
                    >

                        Your cart is empty.

                    </td>

                </tr>

            `;


            updateCartTotals(
                0
            );

            return;

        }


        // ==============================================
        // DISPLAY
        // ==============================================

        tableBody.innerHTML = "";


        let total =
            0;


        for (
            const cartItem
            of cartItems
        ) {

            const cartId =

                cartItem.id ||

                cartItem._id ||

                cartItem.cartId;


            const quantity =
                Number(
                    cartItem.quantity
                ) || 1;


            // ==========================================
            // PRODUCT
            // ==========================================

            let product =
                cartItem.product ||
                cartItem.productData;


            // ==========================================
            // IF PRODUCT OBJECT NOT AVAILABLE
            // ==========================================

            if (
                !product &&
                cartItem.productId
            ) {

                product =
                    await getProductForCart(
                        cartItem.productId
                    );

            }


            if (!product) {

                product = {

                    id:
                        cartItem.productId,

                    name:
                        "Product",

                    price:
                        0

                };

            }


            const productId =

                product.id ||

                product._id ||

                product.productId ||

                cartItem.productId;


            const productName =
                product.name ||
                "Product";


            const price =
                Number(
                    product.price
                ) || 0;


            const itemTotal =
                price *
                quantity;


            total +=
                itemTotal;



            // ==========================================
            // IMAGE
            // ==========================================

            let image =
                product.product_image ||
                product.productUrl ||
                product.productImage ||
                product.image ||
                product.imageUrl ||
                product.url ||
                cartItem.product_image ||
                cartItem.productUrl ||
                cartItem.productImage ||
                "";

            console.log("PRODUCT IMAGE =", image);

            // Convert relative path to full URL
            if (
                image &&
                !image.startsWith("http://") &&
                !image.startsWith("https://") &&
                !image.startsWith("data:")
            ) {

                image =
                    `http://192.168.29.157:3002/${image.replace(/^\/+/, "")}`;
            }

            // Default image
            if (!image) {

                image =
                    "images/product-1.png";
            }

            console.log("FINAL IMAGE URL =", image);


            // ==========================================
            // ROW
            // ==========================================

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td class="product-thumbnail">

                    <img
                        src="${image}"
                        alt="${productName}"
                        class="img-fluid"
                        style="
                            width:80px;
                            height:80px;
                            object-fit:contain;
                        "
                    >

                </td>


                <td class="product-name">

                    <h2 class="h5 text-black">

                        ${productName}

                    </h2>

                </td>


                <td>

                    ₹${price.toFixed(2)}

                </td>


                <td>

                    <div
                        class="input-group mb-3 d-flex align-items-center quantity-container"
                        style="max-width:120px;"
                    >

                        <div
                            class="input-group-prepend"
                        >

                            <button
                                class="btn btn-outline-black decrease"
                                type="button"
                                data-cart-id="${cartId}"
                                data-quantity="${quantity}"
                            >
                                &minus;
                            </button>

                        </div>


                        <input
                            type="text"
                            class="form-control text-center quantity-amount"
                            value="${quantity}"
                            readonly
                        >


                        <div
                            class="input-group-append"
                        >

                            <button
                                class="btn btn-outline-black increase"
                                type="button"
                                data-cart-id="${cartId}"
                                data-quantity="${quantity}"
                                data-stock="${product.stock || 999999}"
                            >
                                &plus;
                            </button>

                        </div>

                    </div>

                </td>


                <td>

                    ₹${itemTotal.toFixed(2)}

                </td>


                <td>

                    <button
                        type="button"
                        class="btn btn-black btn-sm remove-cart-btn"
                        data-cart-id="${cartId}"
                    >
                        X
                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }


        updateCartTotals(
            total
        );


        attachCartEvents();


    }
    catch (error) {

        console.error(
            "CART PAGE ERROR:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center"
                >

                    Cart load nahi ho pa raha hai.

                </td>

            </tr>

        `;

    }

}


// ======================================================
// GET PRODUCT FOR CART
// ======================================================

async function getProductForCart(
    productId
) {

    try {

        const response =
            await fetch(
                `${PRODUCT_API}/${productId}`,
                {
                    method: "GET"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            return null;

        }


        return (
            result.data ||
            result.product ||
            result
        );

    }
    catch (error) {

        console.error(
            "PRODUCT FOR CART ERROR:",
            error
        );

        return null;

    }

}


// ======================================================
// CART EVENTS
// ======================================================

function attachCartEvents() {

    // ==============================================
    // INCREASE
    // ==============================================

    document
        .querySelectorAll(
            ".increase"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    async function () {

                        const cartId =
                            this.dataset.cartId;

                        const quantity =
                            Number(
                                this.dataset.quantity
                            ) + 1;


                        const stock =
                            Number(
                                this.dataset.stock
                            );


                        if (
                            stock &&
                            quantity > stock
                        ) {

                            alert(
                                "Stock available nahi hai."
                            );

                            return;

                        }


                        try {

                            await updateCartQuantity(
                                cartId,
                                quantity
                            );


                            await loadCartPage();

                        }
                        catch (error) {

                            alert(
                                error.message
                            );

                        }

                    }
                );

            }
        );


    // ==============================================
    // DECREASE
    // ==============================================

    document
        .querySelectorAll(
            ".decrease"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    async function () {

                        const cartId =
                            this.dataset.cartId;

                        const quantity =
                            Number(
                                this.dataset.quantity
                            ) - 1;


                        if (
                            quantity < 1
                        ) {

                            return;

                        }


                        try {

                            await updateCartQuantity(
                                cartId,
                                quantity
                            );


                            await loadCartPage();

                        }
                        catch (error) {

                            alert(
                                error.message
                            );

                        }

                    }
                );

            }
        );


    // ==============================================
    // REMOVE
    // ==============================================

    document
        .querySelectorAll(
            ".remove-cart-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    async function () {

                        const cartId =
                            this.dataset.cartId;


                        const confirmDelete =
                            confirm(
                                "Kya aap is product ko cart se remove karna chahte hain?"
                            );


                        if (
                            !confirmDelete
                        ) {

                            return;

                        }


                        try {

                            await deleteCart(
                                cartId
                            );


                            await loadCartPage();

                        }
                        catch (error) {

                            alert(
                                error.message
                            );

                        }

                    }
                );

            }
        );

}


// ======================================================
// CART TOTAL
// ======================================================

function updateCartTotals(
    total
) {

    const subtotal =
        document.getElementById(
            "cartSubtotal"
        );


    const cartTotal =
        document.getElementById(
            "cartTotal"
        );


    if (subtotal) {

        subtotal.textContent =
            `₹${total.toFixed(2)}`;

    }


    if (cartTotal) {

        cartTotal.textContent =
            `₹${total.toFixed(2)}`;

    }

}