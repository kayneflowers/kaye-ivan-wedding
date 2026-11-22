
/* =====================================
   KAYE & IVAN
   SCROLLABLE WEDDING NEWSPAPER
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  const pages = document.querySelectorAll(".paper-page");

  // Show all newspaper pages
  pages.forEach(function (page) {
    page.classList.add("active");
    page.setAttribute("aria-hidden", "false");
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

      const target = document.querySelector(
        link.getAttribute("href")
      );

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    });

  });

  console.log("Kaye and Ivan scrollable newspaper ready!");

});
