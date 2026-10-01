const ORDER_API =
    // "http://192.168.29.93:3002/api/orders";
      "http://192.168.29.157:3002/api/order";

// ======================================================
// PLACE ORDER
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const placeOrderButton = 
            document.getElementById(
                "placeOrderButton"
            );


        if (!placeOrderButton) {

            console.error(
                "Place Order button nahi mila."
            );

            return;

        }


        placeOrderButton.addEventListener(
            "click",
            async function () {

                // ==========================================
                // GET INPUT VALUES
                // ==========================================

                const addressInput =
                    document.getElementById(
                        "c_address"
                    );


                const phoneInput =
                    document.getElementById(
                        "c_phone"
                    );


                const message =
                    document.getElementById(
                        "orderMessage"
                    );


                if (!addressInput || !phoneInput) {

                    alert(
                        "Address ya Phone field nahi mili."
                    );

                    return;

                }


                const address =
                    addressInput.value.trim();


                const phone =
                    phoneInput.value.trim();


                // ==========================================
                // VALIDATION
                // ==========================================

                if (!address) {

                    alert(
                        "Please address enter karein."
                    );

                    addressInput.focus();

                    return;

                }


                if (!phone) {

                    alert(
                        "Please phone number enter karein."
                    );

                    phoneInput.focus();

                    return;

                }


                // ==========================================
                // TOKEN
                // ==========================================

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


                // ==========================================
                // ORDER DATA
                // ==========================================

                const orderData = {

                    address:
                        address,

                    phone:
                        phone

                };


                console.log(
                    "ORDER DATA:",
                    orderData
                );


                // ==========================================
                // LOADING
                // ==========================================

                placeOrderButton.disabled =
                    true;

                placeOrderButton.textContent =
                    "Placing Order...";


                if (message) {

                    message.style.display =
                        "none";

                }


                try {

                    // ======================================
                    // POST ORDER API
                    // ======================================

                    const response =
                        await fetch(
                            ORDER_API,
                            {

                                method: "POST",

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
                                        orderData
                                    ),

                                cache:
                                    "no-store"

                            }
                        );


                    const result =
                        await response.json();


                    console.log(
                        "ORDER API STATUS:",
                        response.status
                    );


                    console.log(
                        "ORDER API RESPONSE:",
                        result
                    );


                    // ======================================
                    // API ERROR
                    // ======================================

                    if (!response.ok) {

                        throw new Error(

                            result.message ||

                            result.error ||

                            "Order place nahi hua."

                        );

                    }


                    // ======================================
                    // SUCCESS
                    // ======================================

                    console.log(
                        "ORDER SUCCESS:",
                        result
                    );


                    if (message) {

                        message.style.display =
                            "block";

                        message.className =
                            "alert alert-success mt-3";

                        message.textContent =
                            "Order successfully place ho gaya.";

                    }


                    alert(
                        "Order successfully place ho gaya."
                    );


                    // ======================================
                    // CLEAR FORM
                    // ======================================

                    addressInput.value =
                        "";

                    phoneInput.value =
                        "";


                    // ======================================
                    // THANK YOU PAGE
                    // ======================================

                    window.location.href =
                        "thankyou.html";

                }
                catch (error) {

                    console.error(
                        "ORDER API ERROR:",
                        error
                    );


                    if (message) {

                        message.style.display =
                            "block";

                        message.className =
                            "alert alert-danger mt-3";

                        message.textContent =
                            error.message ||
                            "Order place nahi hua.";

                    }


                    alert(
                        error.message ||
                        "Order place nahi hua."
                    );

                }
                finally {

                    placeOrderButton.disabled =
                        false;

                    placeOrderButton.textContent =
                        "Place Order";

                }

            }

        );

    }

);
