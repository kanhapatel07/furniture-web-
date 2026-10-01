/* =========================================================
   CATEGORY API + CATEGORY UI
   ========================================================= */

(() => {

    "use strict";


    /* =====================================================
       API URL
    ===================================================== */

    const CATEGORY_API =
        // "http://192.168.29.93:3002/api/categories";
        "http://192.168.29.157:3002/api/category/create";


    /* =====================================================
       GET AUTH TOKEN
    ===================================================== */

    function getToken() {

        const token =
            localStorage.getItem("token");


        if (!token) {

            console.error(
                "Token not found. Please login."
            );

            return null;

        }


        return token;

    }


    /* =====================================================
       COMMON HEADERS
    ===================================================== */

    function getHeaders() {

        const token =
            getToken();


        if (!token) {

            throw new Error(
                "Authentication token missing. Please login again."
            );

        }


        return {

            "Content-Type":
                "application/json",

            "Authorization":
                `Bearer ${token}`

        };

    }


    /* =====================================================
       HANDLE API RESPONSE
    ===================================================== */

    async function handleResponse(response) {

        const contentType =
            response.headers.get(
                "content-type"
            ) || "";


        let data;


        if (
            contentType.includes(
                "application/json"
            )
        ) {

            data =
                await response.json();

        }

        else {

            data =
                await response.text();

        }


        console.log(
            "API STATUS:",
            response.status
        );


        console.log(
            "API RESPONSE:",
            data
        );


        if (!response.ok) {

            let message =
                "API request failed.";


            if (
                data &&
                typeof data === "object"
            ) {

                message =
                    data.message ||
                    message;

            }

            else if (
                typeof data === "string" &&
                data.trim()
            ) {

                message =
                    data;

            }


            throw new Error(
                message
            );

        }


        return data;

    }


    /* =====================================================
       GET ALL CATEGORIES
       ===================================================== */

    async function getCategories() {

        console.log(
            "GET CATEGORIES API CALL"
        );


        const response =
            await fetch(
                CATEGORY_API,
                {
                    method: "GET",

                    headers:
                        getHeaders()
                }
            );


        return await handleResponse(
            response
        );

    }


    /* =====================================================
       GET CATEGORY BY ID
       ===================================================== */

    async function getCategoryById(id) {

        console.log(
            "GET CATEGORY create:",
             id
        );


        const response =
            await fetch(

                `${CATEGORY_API}/${encodeURIComponent(id)}`,

                {
                    method: "GET",

                    headers:
                        getHeaders()
                }

            );


        return await handleResponse(
            response
        );

    }


    /* =====================================================
       CREATE CATEGORY
       ===================================================== */

    async function createCategory(
        name,
        description
    ) {

        console.log(
            "POST CATEGORY:",
            {
                name,
                description
            }
        );


        const response =
            await fetch(

                CATEGORY_API,

                {

                    method: "POST",

                    headers:
                        getHeaders(),

                    body:
                        JSON.stringify({

                            name:
                                name,

                            description:
                                description

                        })

                }

            );


        return await handleResponse(
            response
        );

    }


    /* =====================================================
       UPDATE CATEGORY
       ===================================================== */

    async function updateCategory(
        id,
        name,
        description
    ) {

        console.log(
            "PUT CATEGORY create:",
            id
        );


        const response =
            await fetch(

                `${CATEGORY_API}/${encodeURIComponent(id)}`,

                {

                    method: "PUT",

                    headers:
                        getHeaders(),

                    body:
                        JSON.stringify({

                            name:
                                name,

                            description:
                                description

                        })

                }

            );


        return await handleResponse(
            response
        );

    }


    /* =====================================================
       DELETE CATEGORY
       ===================================================== */

    async function deleteCategoryAPI(
        id
    ) {

        console.log(
            "DELETE CATEGORY:",
            id
        );


        const response =
            await fetch(

                `${CATEGORY_API}/${encodeURIComponent(id)}`,

                {

                    method: "DELETE",

                    headers:
                        getHeaders()

                }

            );


        return await handleResponse(
            response
        );

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            value ?? "";


        return div.innerHTML;

    }


    /* =====================================================
       INITIALIZE CATEGORY PAGE
       ===================================================== */

    function initCategoryPage() {

        const categoryTable =
            document.getElementById(
                "categoryTable"
            );


        const categoryNameInput =
            document.getElementById(
                "categoryName"
            );


        const descriptionInput =
            document.getElementById(
                "description"
            );


        const categorySubmitButton =
            document.getElementById(
                "categorySubmitButton"
            );


        if (!categoryTable) {

            console.log(
                "Category table not found."
            );

            return;

        }


        console.log(
            "CATEGORY PAGE INITIALIZED"
        );


        let categoryEditId =
            null;


        /* =================================================
           DISPLAY CATEGORIES
           ================================================= */

        function displayCategories(
            categories
        ) {

            categoryTable.innerHTML =
                "";


            if (
                !Array.isArray(
                    categories
                ) ||
                categories.length === 0
            ) {

                categoryTable.innerHTML = `

                    <tr>

                        <td colspan="3">
                            No categories found.
                        </td>

                    </tr>

                `;

                return;

            }


            categories.forEach(
                function(category) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    const categoryId =
                        category.id ??
                        category._id;


                    row.innerHTML = `

                        <td>
                            ${escapeHTML(
                                category.name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                category.description
                            )}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="edit-btn"
                                data-id="${escapeHTML(
                                    String(categoryId)
                                )}">
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-btn"
                                data-id="${escapeHTML(
                                    String(categoryId)
                                )}">
                                Delete
                            </button>

                        </td>

                    `;


                    categoryTable.appendChild(
                        row
                    );

                }
            );

        }


        /* =================================================
           LOAD CATEGORIES
           ================================================= */

        async function loadCategories() {

            categoryTable.innerHTML = `

                <tr>

                    <td colspan="3">
                        Loading categories...
                    </td>

                </tr>

            `;


            try {

                const response =
                    await getCategories();


                let categories =
                    [];


                if (
                    Array.isArray(
                        response
                    )
                ) {

                    categories =
                        response;

                }

                else if (
                    Array.isArray(
                        response?.data
                    )
                ) {

                    categories =
                        response.data;

                }

                else if (
                    Array.isArray(
                        response?.data?.categories
                    )
                ) {

                    categories =
                        response.data.categories;

                }

                else if (
                    Array.isArray(
                        response?.categories
                    )
                ) {

                    categories =
                        response.categories;

                }


                console.log(
                    "CATEGORIES FROM API:",
                    categories
                );


                displayCategories(
                    categories
                );

            }

            catch (error) {

                console.error(
                    "LOAD CATEGORY ERROR:",
                    error
                );


                categoryTable.innerHTML = `

                    <tr>

                        <td colspan="3">

                            ${escapeHTML(
                                error.message
                            )}

                        </td>

                    </tr>

                `;

            }

        }


        /* =================================================
           ADD / UPDATE CATEGORY
           ================================================= */

        if (categorySubmitButton) {

            categorySubmitButton.addEventListener(
                "click",
                async function() {

                    const name =
                        categoryNameInput
                            .value
                            .trim();


                    const description =
                        descriptionInput
                            .value
                            .trim();


                    if (!name) {

                        alert(
                            "Please enter category name."
                        );

                        return;

                    }


                    if (!description) {

                        alert(
                            "Please enter description."
                        );

                        return;

                    }


                    try {

                        categorySubmitButton.disabled =
                            true;


                        /* =========================
                           UPDATE
                           ========================= */

                        if (
                            categoryEditId !==
                            null
                        ) {

                            categorySubmitButton.textContent =
                                "Updating...";


                            await updateCategory(

                                categoryEditId,

                                name,

                                description

                            );


                            alert(
                                "Category updated successfully!"
                            );

                        }


                        /* =========================
                           CREATE
                           ========================= */

                        else {

                            categorySubmitButton.textContent =
                                "Adding...";


                            await createCategory(

                                name,

                                description

                            );


                            alert(
                                "Category added successfully!"
                            );

                        }


                        categoryEditId =
                            null;


                        categoryNameInput.value =
                            "";


                        descriptionInput.value =
                            "";


                        categorySubmitButton.textContent =
                            "+ Add";


                        await loadCategories();

                    }

                    catch (error) {

                        console.error(
                            "CATEGORY SAVE ERROR:",
                            error
                        );


                        alert(
                            error.message ||
                            "Category operation failed."
                        );

                    }

                    finally {

                        categorySubmitButton.disabled =
                            false;


                        if (
                            categoryEditId ===
                            null
                        ) {

                            categorySubmitButton.textContent =
                                "+ Add";

                        }

                    }

                }
            );

        }


        /* =================================================
           EDIT / DELETE
           ================================================= */

        categoryTable.addEventListener(
            "click",
            async function(event) {

                const button =
                    event.target.closest(
                        "button"
                    );


                if (!button) {

                    return;

                }


                const id =
                    button.dataset.id;


                /* =========================
                   EDIT
                   ========================= */

                if (
                    button.classList.contains(
                        "edit-btn"
                    )
                ) {

                    try {

                        const response =
                            await getCategoryById(
                                id
                            );


                        let category =
                            response;


                        if (
                            response?.data
                        ) {

                            category =
                                response.data;

                        }


                        if (
                            category?.category
                        ) {

                            category =
                                category.category;

                        }


                        categoryEditId =
                            category.id ??
                            category._id ??
                            id;


                        categoryNameInput.value =
                            category.name ??
                            "";


                        descriptionInput.value =
                            category.description ??
                            "";


                        categorySubmitButton.textContent =
                            "Update Category";


                        categoryNameInput.focus();

                    }

                    catch (error) {

                        console.error(
                            "EDIT CATEGORY ERROR:",
                            error
                        );


                        alert(
                            error.message ||
                            "Unable to load category."
                        );

                    }

                }


                /* =========================
                   DELETE
                   ========================= */

                if (
                    button.classList.contains(
                        "delete-btn"
                    )
                ) {

                    const confirmDelete =
                        confirm(
                            "Are you sure you want to delete this category?"
                        );


                    if (!confirmDelete) {

                        return;

                    }


                    try {

                        await deleteCategoryAPI(
                            id
                        );


                        alert(
                            "Category deleted successfully!"
                        );


                        await loadCategories();

                    }

                    catch (error) {

                        console.error(
                            "DELETE CATEGORY ERROR:",
                            error
                        );


                        alert(
                            error.message ||
                            "Category delete failed."
                        );

                    }

                }

            }
        );


        /* =================================================
           INITIAL LOAD
           ================================================= */

        loadCategories();

    }


    /* =====================================================
       DOM READY
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initCategoryPage,
            {
                once: true
            }
        );

    }

    else {

        initCategoryPage();

    }

})();