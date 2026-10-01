
const registrationForm = document.getElementById("Registration Form");

registrationForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const mobile = document.getElementById("mobile").value.trim();

    // Gender
    const genderElement = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!genderElement) {
        alert("Please select gender");
        return;
    }

    const gender = genderElement.value;

    // API data
    const userData = {
        name: name,
        email: email,
        password: password,
        mobile: mobile,
        gender: gender
    };

    console.log("Registration Data:", userData);

    try {

        const response = await fetch(
            "http://192.168.29.157:3002/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(userData)
            }
        );

        const data = await response.json();

        console.log("API Response:", data);

        if (response.ok) {

            alert("Registration successful!");

            // Go to login page
            window.location.href = "login.html";

        } else {

            alert(data.message || "Registration failed!");

        }

    } catch (error) {

        console.error("Error:", error);

        alert("Server se connection nahi ho pa raha hai.");
    }
});

