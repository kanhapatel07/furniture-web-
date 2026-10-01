const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const loginData = {
        email: email,
        password: password
    };

    console.log("Login Data:", loginData);

    try {

        const response = await fetch(
            "http://192.168.29.157:3002/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            }
        );

        console.log("Status:", response.status);

        const data = await response.json();

        console.log("Login Response:", data);

        if (response.ok) {

            localStorage.setItem("token", data.token);

            alert("Login successful!");

            if (
                email === "admin@gmail.com" &&
                password === "123456"
            ) {
                window.location.href = "../admin/admin.html";
            } else {
                window.location.href = "../../index.html";
            }

        } else {

            alert(data.message || "Login failed!");

        }

    } catch (error) {

        console.error("LOGIN ERROR:", error);
        alert("Login request failed");

    }
});