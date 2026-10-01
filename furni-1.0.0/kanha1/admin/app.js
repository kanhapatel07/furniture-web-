/* =====================================================
   PAGE NAVIGATION
===================================================== */

const sections =
    document.querySelectorAll(".page-section");

const navLinks =
    document.querySelectorAll("nav a");

const viewButtons =
    document.querySelectorAll(".view-btn");


function showSection(sectionId) {

    sections.forEach(function(section) {

        section.classList.remove("active");

    });


    const selectedSection =
        document.getElementById(sectionId);


    if (selectedSection) {

        selectedSection.classList.add("active");

    }


    navLinks.forEach(function(link) {

        link.classList.remove("active");


        if (
            link.dataset.section === sectionId
        ) {

            link.classList.add("active");

        }

    });


    window.location.hash =
        sectionId;

}


/* =====================================================
   NAVIGATION CLICK
===================================================== */

navLinks.forEach(function(link) {

    link.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            const sectionId =
                link.dataset.section;


            showSection(sectionId);

        }
    );

});


/* =====================================================
   DASHBOARD VIEW BUTTON
===================================================== */

viewButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            showSection(
                button.dataset.section
            );

        }
    );

});


/* =====================================================
   OPEN SECTION FROM URL
===================================================== */

function loadPage() {

    let sectionId =
        window.location.hash.substring(1);


    if (!sectionId) {

        sectionId =
            "dashboard";

    }


    if (
        !document.getElementById(sectionId)
    ) {

        sectionId =
            "dashboard";

    }


    showSection(sectionId);

}


loadPage();


/* =====================================================
   DASHBOARD
===================================================== */

const totalProducts =
    document.getElementById(
        "totalProducts"
    );


const totalOrders =
    document.getElementById(
        "totalOrders"
    );


const totalUsers =
    document.getElementById(
        "totalUsers"
    );


const totalSales =
    document.getElementById(
        "totalSales"
    );


if (totalProducts) {

    totalProducts.textContent =
        "0";

}


if (totalOrders) {

    totalOrders.textContent =
        "0";

}


if (totalUsers) {

    totalUsers.textContent =
        "0";

}


if (totalSales) {

    totalSales.textContent =
        "₹0";

}


/* =====================================================
   PROFILE DROPDOWN
===================================================== */

const profileButton =
    document.getElementById(
        "profileButton"
    );


const profileDropdown =
    document.querySelector(
        ".profile-dropdown"
    );


if (
    profileButton &&
    profileDropdown
) {

    profileButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            profileDropdown.classList.toggle(
                "active"
            );

        }
    );


    document.addEventListener(
        "click",
        function() {

            profileDropdown.classList.remove(
                "active"
            );

        }
    );

}

