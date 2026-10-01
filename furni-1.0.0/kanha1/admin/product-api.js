// ======================================================
// PRODUCT API
// ======================================================

const PRODUCT_API =
    // "http://192.168.29.93:3002/api/products";
         "http://192.168.29.157:3002/api/product";
const CATEGORY_API =
    // "http://192.168.29.93:3002/api/categories";
        "http://192.168.29.157:3002/api/category/create";

let editingProductId = null;


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    loadProducts();
    loadProductCategories();

    const openBtn =
        document.getElementById("openProductForm");
 
    const cancelBtn =
        document.getElementById("productCancelButton");

    const productForm =
        document.getElementById("productForm");

    if (openBtn) {

        openBtn.addEventListener(
            "click",
            openAddProductForm
        );

    }

    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            closeProductForm
        );

    }

    if (productForm) {

        productForm.addEventListener(
            "submit",
            handleProductSubmit
        );

    }

});


// ======================================================
// GET ALL PRODUCTS
// ======================================================

async function loadProducts() {

    const productTable =
        document.getElementById("productTable");

    if (productTable) {

        productTable.innerHTML = `
            <tr>
                <td colspan="9">
                    Loading products...
                </td>
            </tr>
        `;

    }

    try {

        const token =
            localStorage.getItem("token");

        const headers = {};

        if (token) {

            headers["Authorization"] =
                `Bearer ${token}`;

        }

        const response =
            await fetch(
                PRODUCT_API,
                {
                    method: "GET",
                    headers: headers
                }
            );

        const result =
            await response.json();

        console.log(
            "PRODUCT GET RESPONSE:",
            result
        );

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Product API Error"
            );

        }

        let products = [];

        if (Array.isArray(result)) {

            products = result;

        }
        else if (
            Array.isArray(result.data)
        ) {

            products = result.data;

        }
        else if (
            Array.isArray(result.products)
        ) {

            products = result.products;

        }
        else if (
            result.data &&
            Array.isArray(result.data.products)
        ) {

            products =
                result.data.products;

        }

        displayProducts(products);

        updateProductCount(
            products.length
        );

    }
    catch (error) {

        console.error(
            "GET PRODUCT ERROR:",
            error
        );

        if (productTable) {

            productTable.innerHTML = `
                <tr>
                    <td colspan="9">
                        Unable to load products
                    </td>
                </tr>
            `;

        }

    }

}


// ======================================================
// DISPLAY PRODUCTS
// ======================================================

function displayProducts(products) {

    const productTable =
        document.getElementById(
            "productTable"
        );

    if (!productTable) {

        return;

    }

    productTable.innerHTML = "";

    if (
        !products ||
        products.length === 0
    ) {

        productTable.innerHTML = `
            <tr>
                <td colspan="9">
                    No products found
                </td>
            </tr>
        `;

        return;

    }

    products.forEach(
        function (product, index) {

            const productId =

                product.id ||

                product._id ||

                product.productId ||

                "";


            // ==========================================
            // IMAGE
            // ==========================================

            let productImage = "";

            if (product.productUrl) {

                productImage =
                    product.productUrl;

            }
            else if (product.productImage) {

                productImage =
                    product.productImage;

            }
            else if (product.image) {

                productImage =
                    product.image;

            }
            else if (product.imageUrl) {

                productImage =
                    product.imageUrl;

            }
            else if (product.url) {

                productImage =
                    product.url;

            }


            if (
                productImage &&
                !productImage.startsWith(
                    "http://"
                ) &&
                !productImage.startsWith(
                    "https://"
                ) &&
                !productImage.startsWith(
                    "data:"
                )
            ) {

                productImage =
                    "http://192.168.29.157:3002/" +
                    productImage.replace(
                        /^\/+/,
                        ""
                    );

            }


            let imageHTML =
                "No Image";


            if (productImage) {

                const imageUrl =
                    product.imageUrl
                        ? `http://192.168.29.157:3002${product.imageUrl}`
                        : productImage;

                imageHTML = `
                    <img
                        src="${imageUrl}"
                        alt="${product.name || "Product"}"
                        width="60"
                        height="60"
                        style="
                            width:60px;
                            height:60px;
                            object-fit:cover;
                            border-radius:6px;
                            display:block;
                        "
                        onerror="
                            this.onerror=null;
                            this.style.display='none';
                            this.parentElement.innerHTML='Image Error';
                        "
                    >
                `;

            }


            // ==========================================
            // CATEGORY
            // ==========================================

            let categoryName =
                "N/A";


            if (product.category) {

                if (
                    typeof product.category ===
                    "object"
                ) {

                    categoryName =

                        product.category.name ||

                        product.category.categoryName ||

                        product.category.id ||

                        product.category._id ||

                        "N/A";

                }
                else {

                    categoryName =
                        product.category;

                }

            }
            else if (
                product.categoryName
            ) {

                categoryName =
                    product.categoryName;

            }
            else if (
                product.categoryId
            ) {

                categoryName =
                    product.categoryId;

            }


            // ==========================================
            // STATUS
            // ==========================================

            const status =
                product.status ||
                "ACTIVE";


            // ==========================================
            // TABLE ROW
            // ==========================================

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${productId}
                </td>

                <td>
                    ${imageHTML}
                </td>

                <td>
                    ${product.name || ""}
                </td>

                <td>
                    ${product.description || ""}
                </td>

                <td>
                    <span
                        class="product-status ${String(
                            status
                        ).toLowerCase()}">

                        ${status}

                    </span>
                </td>

                <td>
                    ₹${product.price || 0}
                </td>

                <td>
                    ${product.stock || 0}
                </td>

                <td>
                    ${categoryName}
                </td>

                <td>

                    <button
                        type="button"
                        class="edit-product-btn"
                        onclick="editProduct('${productId}')">

                        Edit

                    </button>

                    <button
                        type="button"
                        class="delete-product-btn"
                        onclick="deleteProduct('${productId}')">

                        Delete

                    </button>

                </td>

            `;

            productTable.appendChild(row);

        }
    );

}


// ======================================================
// GET CATEGORIES
// ======================================================

async function loadProductCategories() {

    try {

        const token =
            localStorage.getItem("token");

        const headers = {};

        if (token) {

            headers["Authorization"] =
                `Bearer ${token}`;

        }

        const response =
            await fetch(
                CATEGORY_API,
                {
                    method: "GET",
                    headers: headers
                }
            );

        const result =
            await response.json();

        console.log(
            "CATEGORY RESPONSE:",
            result
        );

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Category API Error"
            );

        }

        let categories = [];

        // ==========================================
        // HANDLE DIFFERENT API RESPONSE FORMATS
        // ==========================================

        if (Array.isArray(result)) {

            categories = result;

        }
        else if (
            Array.isArray(result.data)
        ) {

            categories = result.data;

        }
        else if (
            result.data &&
            Array.isArray(result.data.categories)
        ) {

            categories =
                result.data.categories;

        }
        else if (
            Array.isArray(result.categories)
        ) {

            categories = result.categories;

        }


        console.log(
            "CATEGORIES:",
            categories
        );


        const categorySelect =
            document.getElementById(
                "productCategory"
            );

        if (!categorySelect) {

            console.error(
                "productCategory select nahi mila"
            );

            return;

        }


        categorySelect.innerHTML = `
            <option value="">
                Select Category
            </option>
        `;


        categories.forEach(
            function (category) {

                const categoryId =

                    category.id ??

                    category._id ??

                    category.categoryId;


                const categoryName =

                    category.name ??

                    category.categoryName ??

                    category.title ??

                    categoryId;


                if (
                    categoryId === undefined ||
                    categoryId === null ||
                    categoryId === ""
                ) {

                    return;

                }


                const option =
                    document.createElement(
                        "option"
                    );


                // IMPORTANT:
                // Always convert ID to string

                option.value =
                    String(categoryId);


                option.textContent =
                    categoryName;


                categorySelect.appendChild(
                    option
                );

            }
        );


        console.log(
            "Category dropdown loaded"
        );

    }
    catch (error) {

        console.error(
            "CATEGORY LOAD ERROR:",
            error
        );

    }

}


// ======================================================
// OPEN ADD PRODUCT FORM
// ======================================================

function openAddProductForm() {

    editingProductId = null;

    const formSection =
        document.getElementById(
            "productFormSection"
        );

    const formTitle =
        document.getElementById(
            "formTitle"
        );

    const submitButton =
        document.getElementById(
            "productSubmitButton"
        );

    const productForm =
        document.getElementById(
            "productForm"
        );


    if (formSection) {

        formSection.style.display =
            "block";

    }


    if (formTitle) {

        formTitle.textContent =
            "Add Product";

    }


    if (submitButton) {

        submitButton.textContent =
            "Add Product";

    }


    if (productForm) {

        productForm.reset();

    }


    loadProductCategories();

}


// ======================================================
// CLOSE PRODUCT FORM
// ======================================================

function closeProductForm() {

    editingProductId = null;

    const formSection =
        document.getElementById(
            "productFormSection"
        );

    const productForm =
        document.getElementById(
            "productForm"
        );


    if (formSection) {

        formSection.style.display =
            "none";

    }


    if (productForm) {

        productForm.reset();

    }

}


// ======================================================
// ADD / UPDATE PRODUCT
// ======================================================

async function handleProductSubmit(event) {

    event.preventDefault();


    // ==========================================
    // INPUTS
    // ==========================================

    const imageInput =
        document.getElementById("image");

    const nameInput =
        document.getElementById("productName");

    const descriptionInput =
        document.getElementById(
            "productDescription"
        );

    const priceInput =
        document.getElementById(
            "productPrice"
        );

    const stockInput =
        document.getElementById(
            "productStock"
        );

    const categoryInput =
        document.getElementById(
            "productCategory"
        );

    const statusInput =
        document.getElementById(
            "productStatus"
        );


    // ==========================================
    // VALUES
    // ==========================================

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const description =
        descriptionInput
            ? descriptionInput.value.trim()
            : "";

    const price =
        priceInput
            ? priceInput.value
            : "";

    const stock =
        stockInput
            ? stockInput.value
            : "";

    const categoryId =
        categoryInput
            ? categoryInput.value
            : "";

    const status =
        statusInput
            ? statusInput.value
            : "ACTIVE";


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name) {

        alert(
            "Please enter product name"
        );

        return;

    }


    if (!description) {

        alert(
            "Please enter description"
        );

        return;

    }


    if (!price) {

        alert(
            "Please enter price"
        );

        return;

    }


    if (!stock) {

        alert(
            "Please enter stock"
        );

        return;

    }


    if (!categoryId) {

        alert(
            "Please select category"
        );

        return;

    }


    // ==========================================
    // TOKEN
    // ==========================================

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Authentication token nahi mila. Please login again."
        );

        return;

    }


    try {

        let response;


        // ==================================================
        // UPDATE PRODUCT
        // FORMDATA
        // ==================================================

        if (editingProductId) {

            const formData =
                new FormData();


            // IMAGE

            if (
                imageInput &&
                imageInput.files &&
                imageInput.files.length > 0
            ) {

                formData.append(
                    "productUrl",
                    imageInput.files[0]
                );

            }


            // PRODUCT DATA

            formData.append(
                "name",
                name
            );


            formData.append(
                "description",
                description
            );


            formData.append(
                "status",
                status
            );


            formData.append(
                "price",
                String(Number(price))
            );


            formData.append(
                "stock",
                String(Number(stock))
            );


            formData.append(
                "categoryId",
                String(Number(categoryId))
            );


            console.log(
                "========== UPDATE PRODUCT =========="
            );


            for (
                const [
                    key,
                    value
                ]
                of formData.entries()
            ) {

                if (
                    value instanceof File
                ) {

                    console.log(
                        key,
                        "FILE:",
                        value.name
                    );

                }
                else {

                    console.log(
                        key,
                        value
                    );

                }

            }


            response =
                await fetch(
                    `${PRODUCT_API}/${editingProductId}`,
                    {
                        method: "PUT",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            formData

                    }
                );

        }


        // ==================================================
        // ADD PRODUCT
        // FORMDATA
        // ==================================================

        else {

            const formData =
                new FormData();


            // IMAGE

            if (
                imageInput &&
                imageInput.files &&
                imageInput.files.length > 0
            ) {

                formData.append(
                    "productUrl",
                    imageInput.files[0]
                );

            }


            // PRODUCT DATA

            formData.append(
                "name",
                name
            );


            formData.append(
                "description",
                description
            );


            formData.append(
                "status",
                status
            );


            formData.append(
                "price",
                price
            );


            formData.append(
                "stock",
                stock
            );


            formData.append(
                "categoryId",
                categoryId
            );


            console.log(
                "========== ADD PRODUCT FORMDATA =========="
            );


            for (
                const [
                    key,
                    value
                ]
                of formData.entries()
            ) {

                if (
                    value instanceof File
                ) {

                    console.log(
                        key,
                        "FILE:",
                        value.name
                    );

                }
                else {

                    console.log(
                        key,
                        value
                    );

                }

            }


            response =
                await fetch(
                    PRODUCT_API,
                    {
                        method: "POST",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            formData

                    }
                );

        }


        // ==================================================
        // RESPONSE
        // ==================================================

        const result =
            await response.json();


        console.log(
            "PRODUCT SAVE RESPONSE:",
            result
        );


        // ==================================================
        // ERROR
        // ==================================================

        if (!response.ok) {

            alert(
                result.message ||
                "Product save failed"
            );

            return;

        }


        // ==================================================
        // SUCCESS
        // ==================================================

        if (editingProductId) {

            alert(
                "Product updated successfully"
            );

        }
        else {

            alert(
                "Product added successfully"
            );

        }


        // ==================================================
        // CLOSE
        // ==================================================

        closeProductForm();


        // ==================================================
        // RELOAD
        // ==================================================

        await loadProducts();

    }
    catch (error) {

        console.log(
            "PRODUCT SAVE ERROR:",
            error
        );


        alert(
            "Product API se connect nahi ho pa raha hai."
        );

    }

}


// ======================================================
// GET PRODUCT BY ID
// ======================================================

async function getProductById(id) {

    try {

        const token =
            localStorage.getItem("token");

        const headers = {};

        if (token) {

            headers["Authorization"] =
                `Bearer ${token}`;

        }

        console.log("Product ID:", id);

        console.log(
            "Product URL:",
            `${PRODUCT_API}/${id}`
        );

        const response =
            await fetch(
                `${PRODUCT_API}/${id}`,
                {
                    method: "GET",
                    headers: headers
                }
            );

        const result =
            await response.json();

        console.log(
            "PRODUCT BY ID:",
            result
        );

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Product not found"
            );

        }

        return (
            result.data ||
            result.product ||
            result
        );

    }
    catch (error) {

        console.error(
            "GET PRODUCT BY ID ERROR:",
            error
        );

        return null;

    }

}

// ======================================================
// EDIT PRODUCT
// ======================================================

async function editProduct(id) {

    try {

        // ==========================================
        // GET PRODUCT
        // ==========================================

        const product =
            await getProductById(id);


        if (!product) {

            alert(
                "Product data nahi mila"
            );

            return;

        }


        console.log(
            "EDIT PRODUCT DATA:",
            product
        );


        // ==========================================
        // SET EDITING ID
        // ==========================================

        editingProductId =
            id;


        // ==========================================
        // FORM ELEMENTS
        // ==========================================

        const formSection =
            document.getElementById(
                "productFormSection"
            );

        const formTitle =
            document.getElementById(
                "formTitle"
            );

        const submitButton =
            document.getElementById(
                "productSubmitButton"
            );

        const nameInput =
            document.getElementById(
                "productName"
            );

        const descriptionInput =
            document.getElementById(
                "productDescription"
            );

        const priceInput =
            document.getElementById(
                "productPrice"
            );

        const stockInput =
            document.getElementById(
                "productStock"
            );

        const categoryInput =
            document.getElementById(
                "productCategory"
            );

        const statusInput =
            document.getElementById(
                "productStatus"
            );


        // ==========================================
        // SHOW FORM
        // ==========================================

        if (formSection) {

            formSection.style.display =
                "block";

        }


        if (formTitle) {

            formTitle.textContent =
                "Edit Product";

        }


        if (submitButton) {

            submitButton.textContent =
                "Update Product";

        }


        // ==========================================
        // IMPORTANT:
        // LOAD CATEGORIES FIRST
        // ==========================================

        await loadProductCategories();


        // ==========================================
        // SET PRODUCT DATA
        // ==========================================

        if (nameInput) {

            nameInput.value =
                product.name || "";

        }


        if (descriptionInput) {

            descriptionInput.value =
                product.description || "";

        }


        if (priceInput) {

            priceInput.value =
                product.price ?? "";

        }


        if (stockInput) {

            stockInput.value =
                product.stock ?? "";

        }


        if (statusInput) {

            statusInput.value =
                product.status ||
                "ACTIVE";

        }


        // ==========================================
        // GET CATEGORY ID
        // ==========================================

        let categoryId = "";


        // ------------------------------------------
        // CASE 1:
        // categoryId directly available
        // ------------------------------------------

        if (
            product.categoryId !== undefined &&
            product.categoryId !== null
        ) {

            categoryId =
                product.categoryId;

        }


        // ------------------------------------------
        // CASE 2:
        // category object
        // ------------------------------------------

        else if (
            product.category &&
            typeof product.category === "object"
        ) {

            categoryId =

                product.category.id ??

                product.category._id ??

                product.category.categoryId ??

                "";

        }


        // ------------------------------------------
        // CASE 3:
        // category directly value
        // ------------------------------------------

        else if (
            product.category !== undefined &&
            product.category !== null
        ) {

            categoryId =
                product.category;

        }


        console.log(
            "EDIT CATEGORY ID:",
            categoryId
        );


        // ==========================================
        // SELECT CATEGORY
        // ==========================================

        if (
            categoryInput &&
            categoryId !== ""
        ) {

            categoryInput.value =
                String(categoryId);


            // ======================================
            // MAKE SURE OPTION IS SELECTED
            // ======================================

            const selectedOption =
                Array.from(
                    categoryInput.options
                ).find(
                    function (option) {

                        return (
                            String(option.value) ===
                            String(categoryId)
                        );

                    }
                );


            if (selectedOption) {

                selectedOption.selected =
                    true;

                console.log(
                    "CATEGORY SELECTED:",
                    selectedOption.textContent
                );

            }
            else {

                console.warn(
                    "Category option nahi mili:",
                    categoryId
                );

                console.log(
                    "Available categories:"
                );

                Array.from(
                    categoryInput.options
                ).forEach(
                    function (option) {

                        console.log(
                            "ID:",
                            option.value,
                            "NAME:",
                            option.textContent
                        );

                    }
                );

            }

        }
        else {

            console.warn(
                "Product categoryId nahi mila"
            );

        }

    }
    catch (error) {

        console.error(
            "EDIT PRODUCT ERROR:",
            error
        );

        alert(
            "Product edit karte time error aaya."
        );

    }

}



// ======================================================
// DELETE PRODUCT
// ======================================================

async function deleteProduct(id) {

    const confirmDelete = confirm(
        "Kya aap is product ko delete karna chahte hain?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const token =
            localStorage.getItem("token");

        if (!token) {

            alert(
                "Authentication token nahi mila."
            );

            return;
        }

        // ==========================================
        // DELETE URL
        // ==========================================

        const deleteUrl =
            `${PRODUCT_API}/${id}`;

        console.log(
            "DELETE PRODUCT ID:",
            id
        );

        console.log(
            "DELETE PRODUCT URL:",
            deleteUrl
        );

        // ==========================================
        // DELETE API
        // ==========================================

        const response =
            await fetch(
                deleteUrl,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );

        // ==========================================
        // RESPONSE
        // ==========================================

        const result =
            await response.json();

        console.log(
            "DELETE PRODUCT STATUS:",
            response.status
        );

        console.log(
            "DELETE PRODUCT RESPONSE:",
            result
        );

        // ==========================================
        // API ERROR
        // ==========================================

        if (!response.ok) {

            alert(
                result.message ||
                result.error ||
                `Delete failed. Status: ${response.status}`
            );

            return;
        }

        // ==========================================
        // SUCCESS
        // ==========================================

        alert(
            "Product deleted successfully"
        );

        // ==========================================
        // RELOAD PRODUCTS
        // ==========================================

        await loadProducts();

    }
    catch (error) {

        console.error(
            "DELETE PRODUCT ERROR:",
            error
        );

        alert(
            "Product delete karte time error aaya. Console check karein."
        );
    }
}

// ======================================================
// DASHBOARD PRODUCT COUNT
// ======================================================

function updateProductCount(count) {

    const totalProducts =
        document.getElementById(
            "totalProducts"
        );


    if (totalProducts) {

        totalProducts.textContent =
            count;

    }

}


// ======================================================
// CATEGORY ADDED EVENT
// ======================================================

window.refreshProductCategories =
    function () {

        loadProductCategories();

    };