// ======================================================
// PRODUCT API
// ======================================================

const PRODUCT_API =
    // "http://192.168.29.93:3002/api/products";
    "http://192.168.29.157:3002/api/product";

const CART_API =
    // "http://192.168.29.93:3002/api/cart";
    "http://192.168.29.157:3002/api/cart";
const API_BASE_URL =
    "http://192.168.29.157:3002";


// ======================================================
// PAGINATION
// ======================================================

let currentPage = 1;

const productsPerPage = 6;

let totalPages = 1;


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadHomeProducts(1);

    }
);


// ======================================================
// LOAD HOME PRODUCTS
// ======================================================

async function loadHomeProducts(page = 1) {

    const productList =
        document.getElementById("productList");


    if (!productList) {

        console.error(
            "productList element nahi mila"
        );

        return;
    }


    currentPage = page;


    productList.innerHTML = `
        <div class="col-12 text-center">
            <p>Loading products...</p>
        </div>
    `;


    try {

        // ==================================================
        // TOKEN
        // ==================================================

        const token =
            localStorage.getItem("token");


        const headers = {
            "Accept": "application/json"
        };


        if (token) {

            headers["Authorization"] =
                `Bearer ${token}`;

        }


        // ==================================================
        // PRODUCT API WITH PAGINATION
        // ==================================================

        const response =
            await fetch(
                `${PRODUCT_API}?page=${page}&limit=${productsPerPage}&_t=${Date.now()}`,
                {
                    method: "GET",
                    headers: headers,
                    cache: "no-store"
                }
            );


        const result =
            await response.json();


        console.log(
            "PRODUCT API RESPONSE:",
            result
        );


        // ==================================================
        // API ERROR
        // ==================================================

        if (!response.ok) {

            throw new Error(
                result.message ||
                result.error ||
                "Product API error"
            );

        }


        // ==================================================
        // GET PRODUCTS
        // ==================================================

        let products = [];


        if (Array.isArray(result)) {

            products = result;

        }

        else if (
            result &&
            Array.isArray(result.data)
        ) {

            products = result.data;

        }

        else if (
            result &&
            Array.isArray(result.products)
        ) {

            products = result.products;

        }

        else if (
            result &&
            result.data &&
            Array.isArray(
                result.data.products
            )
        ) {

            products =
                result.data.products;

        }

        else if (
            result &&
            result.data &&
            Array.isArray(
                result.data.data
            )
        ) {

            products =
                result.data.data;

        }


        // ==================================================
        // GET PAGINATION DATA
        // ==================================================

        const pagination =
            result.pagination ||
            result.meta ||
            result.data?.pagination ||
            {};


        totalPages =
            Number(
                pagination.totalPages ||
                pagination.pages ||
                result.totalPages ||
                result.pages ||
                0
            );


        // ==================================================
        // IF totalPages NOT AVAILABLE
        // ==================================================

        if (!totalPages) {

            const totalProducts =
                Number(
                    pagination.total ||
                    pagination.totalItems ||
                    result.total ||
                    result.totalItems ||
                    0
                );


            if (totalProducts > 0) {

                totalPages =
                    Math.ceil(
                        totalProducts /
                        productsPerPage
                    );

            }

            else {

                totalPages =
                    products.length >=
                        productsPerPage
                        ? currentPage + 1
                        : currentPage;

            }

        }


        console.log(
            "Current Page:",
            currentPage
        );


        console.log(
            "Total Pages:",
            totalPages
        );


        // ==================================================
        // CREATE PAGINATION
        // ==================================================

        createProductPagination(
            totalPages
        );


        // ==================================================
        // PRODUCT ARRAY
        // ==================================================

        console.log(
            "PRODUCT ARRAY:",
            products
        );


        // ==================================================
        // NO PRODUCT
        // ==================================================

        if (
            products.length === 0
        ) {

            productList.innerHTML = `
                <div class="col-12 text-center">

                    <h4>
                        No products found
                    </h4>

                </div>
            `;

            return;

        }


        productList.innerHTML = "";


        let activeProductFound =
            false;


        // ==================================================
        // DISPLAY PRODUCTS
        // ==================================================

        products.forEach(
            function (product) {

                // ==========================================
                // PRODUCT ID
                // ==========================================

                const productId =
                    product.id ||
                    product._id ||
                    product.productId ||
                    "";


                // ==========================================
                // NAME
                // ==========================================

                const name =
                    product.name ||
                    "Product";


                // ==========================================
                // DESCRIPTION
                // ==========================================

                const description =
                    product.description ||
                    "";


                // ==========================================
                // PRICE
                // ==========================================

                const price =
                    product.price ?? 0;


                // ==========================================
                // STOCK
                // ==========================================

                const stock =
                    product.stock ?? 0;


                // ==========================================
                // STATUS
                // ==========================================

                const status =
                    product.status ||
                    "ACTIVE";


                // ==========================================
                // ACTIVE PRODUCT ONLY
                // ==========================================

                if (
                    String(status).toUpperCase() !==
                    "ACTIVE"
                ) {

                    return;

                }


                activeProductFound =
                    true;

                // ==========================================
                // IMAGE
                // ==========================================

                let imageUrl =
                    product.product_image ||
                    product.imageUrl ||
                    product.productUrl ||
                    product.image ||
                    product.productImage ||
                    "";

                if (imageUrl) {

                    imageUrl = String(imageUrl).trim();

                    // Relative image URL
                    if (
                        !imageUrl.startsWith("http://") &&
                        !imageUrl.startsWith("https://")
                    ) {

                        if (!imageUrl.startsWith("/")) {
                            imageUrl = "/" + imageUrl;
                        }

                        imageUrl = API_BASE_URL + imageUrl;
                    }

                } else {

                    imageUrl = "images/product-1.png";
                }

                // ==========================================
                // PRODUCT CARD
                // ==========================================

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "col-12 col-md-6 col-lg-4 mb-5";


                card.innerHTML = `

                    <div
                        class="product-item"
                        data-product-id="${escapeHTML(productId)}"
                    >

                        <!-- PRODUCT IMAGE -->

                        <img
                            src="${escapeHTML(imageUrl)}"
                            alt="${escapeHTML(name)}"
                            class="img-fluid product-thumbnail"
                            style="
                                width:100%;
                                height:220px;
                                object-fit:contain;
                                display:block;
                            "
                            onerror="
                                this.onerror=null;
                                this.src='images/product-1.png';
                            "
                        >


                        <!-- PRODUCT NAME -->

                        <h3
                            class="product-title"
                        >
                            ${escapeHTML(name)}
                        </h3>


                        <!-- PRODUCT PRICE -->

                        <strong
                            class="product-price"
                        >
                            ₹${escapeHTML(price)}
                        </strong>


                        <!-- DESCRIPTION -->

                        <p
                            style="
                                font-size:14px;
                                margin-top:8px;
                            "
                        >
                            ${escapeHTML(description)}
                        </p>


                        <!-- STOCK -->

                        <small
                            style="
                                font-size:14px;
                            "
                        >
                            ${Number(stock) > 0
                        ? "In Stock"
                        : "Out of Stock"
                    }
                        </small>


                        <!-- ADD TO CART -->

                        <button
                            type="button"
                            class="btn btn-black add-to-cart-btn"
                            data-product-id="${escapeHTML(productId)}"
                            data-stock="${escapeHTML(stock)}"
                            style="
                                width:40px;
                                height:40px;
                                padding:0;
                                margin:0 auto;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                font-size:24px;
                                border-radius:50%;
                            "
                        >

                            <i
                                class="fa-solid fa-plus"
                            ></i>

                        </button>

                    </div>

                `;


                productList.appendChild(
                    card
                );


                // ==========================================
                // ADD TO CART BUTTON
                // ==========================================

                const addButton =
                    card.querySelector(
                        ".add-to-cart-btn"
                    );


                if (addButton) {

                    addButton.addEventListener(
                        "click",
                        async function () {

                            const id =
                                this.dataset.productId;


                            const currentStock =
                                Number(
                                    this.dataset.stock
                                );


                            // ==================================
                            // PRODUCT ID CHECK
                            // ==================================

                            if (!id) {

                                alert(
                                    "Product ID nahi mila."
                                );

                                return;

                            }


                            // ==================================
                            // STOCK CHECK
                            // ==================================

                            if (
                                currentStock <= 0
                            ) {

                                alert(
                                    "Product out of stock hai."
                                );

                                return;

                            }


                            try {

                                // ==================================
                                // TOKEN
                                // ==================================

                                const token =
                                    localStorage.getItem(
                                        "token"
                                    );


                                if (!token) {

                                    alert(
                                        "Please login first."
                                    );

                                    return;

                                }


                                // ==================================
                                // CART DATA
                                // ==================================

                                const cartData = {

                                    productId:
                                        Number(id),

                                    quantity: 1

                                };


                                console.log(
                                    "ADD TO CART DATA:",
                                    cartData
                                );


                                // ==================================
                                // POST CART API
                                // ==================================

                                const cartResponse =
                                    await fetch(
                                        CART_API,
                                        {

                                            method:
                                                "POST",

                                            headers: {

                                                "Content-Type":
                                                    "application/json",

                                                "Accept":
                                                    "application/json",

                                                "Authorization":
                                                    `Bearer ${token}`

                                            },

                                            body:
                                                JSON.stringify(
                                                    cartData
                                                ),

                                            cache:
                                                "no-store"

                                        }
                                    );


                                // ==================================
                                // CART RESPONSE
                                // ==================================

                                const cartResult =
                                    await cartResponse.json();


                                console.log(
                                    "ADD TO CART RESPONSE:",
                                    cartResult
                                );


                                // ==================================
                                // CART ERROR
                                // ==================================

                                if (
                                    !cartResponse.ok
                                ) {

                                    throw new Error(
                                        cartResult.message ||
                                        cartResult.error ||
                                        "Product cart me add nahi hua."
                                    );

                                }


                                // ==================================
                                // SUCCESS
                                // ==================================

                                alert(
                                    "Product cart me add ho gaya."
                                );


                                // ==================================
                                // CART PAGE
                                // ==================================

                                window.location.href =
                                    "cart.html";

                            }

                            catch (error) {

                                console.error(
                                    "ADD TO CART ERROR:",
                                    error
                                );


                                alert(
                                    error.message ||
                                    "Product cart me add nahi hua."
                                );

                            }

                        }
                    );

                }

            }
        );


        // ==================================================
        // NO ACTIVE PRODUCT
        // ==================================================

        if (
            !activeProductFound
        ) {

            productList.innerHTML = `
                <div class="col-12 text-center">

                    <h4>
                        No active products found
                    </h4>

                </div>
            `;

        }

    }

    catch (error) {

        console.error(
            "PRODUCT LOAD ERROR:",
            error
        );


        productList.innerHTML = `
            <div class="col-12 text-center">

                <h4>
                    Products load nahi ho rahe
                </h4>

                <p>
                    ${escapeHTML(
            error.message
        )}
                </p>

                <button
                    class="btn"
                    onclick="loadHomeProducts(${currentPage})"
                >
                    Try Again
                </button>

            </div>
        `;

    }

}


// ======================================================
// CREATE PRODUCT PAGINATION
// ======================================================

function createProductPagination(totalPages) {

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

        console.error(
            "paginationNumbers element nahi mila"
        );

        return;

    }


    // ==================================================
    // CLEAR OLD PAGINATION
    // ==================================================

    paginationNumbers.innerHTML = "";


    // ==================================================
    // ONLY ONE PAGE
    // ==================================================

    if (totalPages <= 1) {

        if (prevPage) {

            prevPage.style.display =
                "none";

        }


        if (nextPage) {

            nextPage.style.display =
                "none";

        }


        return;

    }


    // ==================================================
    // PREVIOUS BUTTON
    // ==================================================

    if (prevPage) {

        prevPage.style.display =
            "flex";

        prevPage.disabled =
            currentPage <= 1;


        prevPage.onclick =
            function () {

                if (
                    currentPage > 1
                ) {

                    loadHomeProducts(
                        currentPage - 1
                    );

                }

            };

    }


    // ==================================================
    // NEXT BUTTON
    // ==================================================

    if (nextPage) {

        nextPage.style.display =
            "flex";

        nextPage.disabled =
            currentPage >= totalPages;


        nextPage.onclick =
            function () {

                if (
                    currentPage < totalPages
                ) {

                    loadHomeProducts(
                        currentPage + 1
                    );

                }

            };

    }


    // ==================================================
    // CURRENT PAGE BUTTON
    // ==================================================

    const currentButton =
        document.createElement(
            "button"
        );


    currentButton.type =
        "button";


    currentButton.className =
        "pagination-number active";


    currentButton.textContent =
        currentPage;


    currentButton.disabled =
        true;


    paginationNumbers.appendChild(
        currentButton
    );


    // ==================================================
    // "TO" TEXT
    // ==================================================

    // const toText =
    //     document.createElement(
    //         "span"
    //     );


    // toText.className =
    //     "pagination-to";


    // toText.textContent =
    //     "To";


    // paginationNumbers.appendChild(
    //     toText
    // );
    const toText =
        document.createElement(
            "span"
        );


    toText.className =
        "pagination-to";


    toText.textContent =
        "To";


    // ==================================================
    // TO TEXT STYLE
    // ==================================================

    toText.style.display =
        "inline-flex";

    toText.style.alignItems =
        "center";

    toText.style.justifyContent =
        "center";

    toText.style.width =
        "auto";

    toText.style.minWidth =
        "25px";

    toText.style.height =
        "40px";

    toText.style.marginBottom =
        "200px";

    toText.style.padding =
        "0";

    toText.style.flex =
        "0 0 auto";

    toText.style.whiteSpace =
        "nowrap";

    toText.style.verticalAlign =
        "middle";


    paginationNumbers.appendChild(
        toText
    );

    // ==================================================
    // TOTAL PAGE BUTTON
    // ==================================================

    const totalButton =
        document.createElement(
            "button"
        );


    totalButton.type =
        "button";


    totalButton.className =
        "pagination-number total-page";


    totalButton.textContent =
        totalPages;


    totalButton.addEventListener(
        "click",
        function () {

            if (
                currentPage !== totalPages
            ) {

                loadHomeProducts(
                    totalPages
                );

            }

        }
    );


    paginationNumbers.appendChild(
        totalButton
    );

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