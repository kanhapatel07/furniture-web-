/* =====================================================
   PROFILE FORM
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const profileButton =
            document.getElementById(
                "profileButton"
            );


        const profileMenu =
            document.getElementById(
                "profileMenu"
            );


        const profileFormContainer =
            document.getElementById(
                "profileFormContainer"
            );


        const closeProfileForm =
            document.getElementById(
                "closeProfileForm"
            );


        const profileForm =
            document.getElementById(
                "profileForm"
            );


        /* =================================================
           PROFILE BUTTON
        ================================================= */

        if (profileButton) {

            profileButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    if (
                        profileMenu
                    ) {

                        profileMenu.classList.toggle(
                            "active"
                        );

                    }

                }
            );

        }


        /* =================================================
           OPEN PROFILE FORM
        ================================================= */

        if (profileMenu) {

            profileMenu.addEventListener(
                "click",
                function (event) {

                    const profileLink =
                        event.target.closest(
                            'a[href="#profile"]'
                        );


                    if (!profileLink) {

                        return;

                    }


                    event.preventDefault();


                    /* Close dropdown */

                    profileMenu.classList.remove(
                        "active"
                    );


                    /* Open form */

                    if (
                        profileFormContainer
                    ) {

                        profileFormContainer.style.display =
                            "block";

                    }

                }
            );

        }


        /* =================================================
           CLOSE PROFILE FORM
        ================================================= */

        if (closeProfileForm) {

            closeProfileForm.addEventListener(
                "click",
                function () {

                    profileFormContainer.style.display =
                        "none";

                }
            );

        }


        /* =================================================
           SAVE PROFILE
        ================================================= */

        if (profileForm) {

            profileForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const name =
                        document.getElementById(
                            "profileName"
                        ).value.trim();


                    const email =
                        document.getElementById(
                            "profileEmail"
                        ).value.trim();


                    const phone =
                        document.getElementById(
                            "profilePhone"
                        ).value.trim();


                    const address =
                        document.getElementById(
                            "profileAddress"
                        ).value.trim();


                    if (!name) {

                        alert(
                            "Please enter name."
                        );

                        return;

                    }


                    if (!email) {

                        alert(
                            "Please enter email."
                        );

                        return;

                    }


                    /* Save locally */

                    const profile = {

                        name:
                            name,

                        email:
                            email,

                        phone:
                            phone,

                        address:
                            address

                    };


                    localStorage.setItem(
                        "profile",
                        JSON.stringify(profile)
                    );


                    /* Update profile display */

                    const profileName =
                        document.querySelector(
                            ".profile-container h3"
                        );


                    const profileRole =
                        document.querySelector(
                            ".profile-container p"
                        );


                    if (profileName) {

                        profileName.textContent =
                            name;

                    }


                    if (profileRole) {

                        profileRole.textContent =
                            "Administrator";

                    }


                    alert(
                        "Profile saved successfully!"
                    );


                    /* Close form */

                    profileFormContainer.style.display =
                        "none";

                }
            );

        }


        /* =================================================
           LOAD SAVED PROFILE
        ================================================= */

        const savedProfile =
            localStorage.getItem(
                "profile"
            );


        if (savedProfile) {

            try {

                const profile =
                    JSON.parse(
                        savedProfile
                    );


                const nameInput =
                    document.getElementById(
                        "profileName"
                    );


                const emailInput =
                    document.getElementById(
                        "profileEmail"
                    );


                const phoneInput =
                    document.getElementById(
                        "profilePhone"
                    );


                const addressInput =
                    document.getElementById(
                        "profileAddress"
                    );


                if (nameInput) {

                    nameInput.value =
                        profile.name || "";

                }


                if (emailInput) {

                    emailInput.value =
                        profile.email || "";

                }


                if (phoneInput) {

                    phoneInput.value =
                        profile.phone || "";

                }


                if (addressInput) {

                    addressInput.value =
                        profile.address || "";

                }


                const profileName =
                    document.querySelector(
                        ".profile-container h3"
                    );


                if (
                    profileName &&
                    profile.name
                ) {

                    profileName.textContent =
                        profile.name;

                }

            }

            catch (error) {

                console.error(
                    "Profile load error:",
                    error
                );

            }

        }


        /* =================================================
           CLOSE DROPDOWN OUTSIDE
        ================================================= */

        document.addEventListener(
            "click",
            function () {

                if (profileMenu) {

                    profileMenu.classList.remove(
                        "active"
                    );

                }

            }
        );

    }
);