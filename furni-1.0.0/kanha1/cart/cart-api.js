// ======================================================
// CART API
// ======================================================

const CART_API =
    // "http://192.168.29.93:3002/api/cart";
    "http://192.168.29.157:3002/api/cart";
const PRODUCT_API =
    // "http://192.168.29.93:3002/api/products";
    "http://192.168.29.157:3002/api/product";


// ======================================================
// TOKEN HEADERS
// ======================================================

function getCartHeaders() {

    const token =
        localStorage.getItem(
            "token"
        );


    const headers = {

        "Content-Type":
            "application/json"

    };


    if (token) {

        headers[
            "Authorization"
        ] =
            `Bearer ${token}`;

    }


    return headers;

}


// ======================================================
// GET CART
// ======================================================

async function getCart() {

    try {

        const response =
            await fetch(
                CART_API,
                {
                    method: "GET",

                    headers:
                        getCartHeaders()
                }
            );


        const result =
            await response.json();


        console.log(
            "GET CART RESPONSE:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Cart load nahi hua."
            );

        }


        return extractCartArray(
            result
        );

    }
    catch (error) {

        console.error(
            "GET CART ERROR:",
            error
        );

        return [];

    }

}


// ======================================================
// EXTRACT CART ARRAY
// ======================================================

function extractCartArray(
    result
) {

    if (Array.isArray(result)) {

        return result;

    }


    if (
        result &&
        Array.isArray(result.data)
    ) {

        return result.data;

    }


    if (
        result &&
        Array.isArray(result.cart)
    ) {

        return result.cart;

    }


    if (
        result &&
        result.data &&
        Array.isArray(
            result.data.cart
        )
    ) {

        return result.data.cart;

    }


    return [];

}


// ======================================================
// ADD TO CART
// POST
// ======================================================

async function addToCart(
    productId,
    quantity = 1
) {

    try {

        const cartData = {

            productId:
                Number(productId),

            quantity:
                Number(quantity)

        };


        console.log(
            "POST CART DATA:",
            cartData
        );


        const response =
            await fetch(
                CART_API,
                {
                    method: "POST",

                    headers:
                        getCartHeaders(),

                    body:
                        JSON.stringify(
                            cartData
                        )
                }
            );


        const result =
            await response.json();


        console.log(
            "POST CART RESPONSE:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Product cart me add nahi hua."
            );

        }


        return (
            result.data ||
            result.cart ||
            result
        );

    }
    catch (error) {

        console.error(
            "ADD CART ERROR:",
            error
        );

        throw error;

    }

}


// ======================================================
// GET CART BY ID
// ======================================================

async function getCartById(
    cartId
) {

    try {

        const response =
            await fetch(
                `${CART_API}/${cartId}`,
                {
                    method: "GET",

                    headers:
                        getCartHeaders()
                }
            );


        const result =
            await response.json();


        console.log(
            "GET CART BY ID:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Cart item nahi mila."
            );

        }


        return (
            result.data ||
            result.cart ||
            result
        );

    }
    catch (error) {

        console.error(
            "GET CART BY ID ERROR:",
            error
        );

        return null;

    }

}


// ======================================================
// UPDATE CART QUANTITY
// PUT
// ======================================================

async function updateCartQuantity(
    cartId,
    quantity
) {

    try {

        const cartData = {

            quantity:
                Number(quantity)

        };


        console.log(
            "UPDATE CART DATA:",
            cartData
        );


        const response =
            await fetch(
                `${CART_API}/${cartId}`,
                {
                    method: "PUT",

                    headers:
                        getCartHeaders(),

                    body:
                        JSON.stringify(
                            cartData
                        )
                }
            );


        const result =
            await response.json();


        console.log(
            "UPDATE CART RESPONSE:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Quantity update nahi hui."
            );

        }


        return (
            result.data ||
            result.cart ||
            result
        );

    }
    catch (error) {

        console.error(
            "UPDATE CART ERROR:",
            error
        );

        throw error;

    }

}


// ======================================================
// DELETE CART
// ======================================================

async function deleteCart(
    cartId
) {

    try {

        const response =
            await fetch(
                `${CART_API}/${cartId}`,
                {
                    method: "DELETE",

                    headers:
                        getCartHeaders()
                }
            );


        const result =
            await response.json();


        console.log(
            "DELETE CART RESPONSE:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Cart item delete nahi hua."
            );

        }


        return result;

    }
    catch (error) {

        console.error(
            "DELETE CART ERROR:",
            error
        );

        throw error;

    }

}