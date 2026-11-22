
/* =========================================
   KAYE & IVAN
   FOUR-PAGE DIGITAL NEWSPAPER
   ANDROID NAVIGATION FIX
========================================= */

(function () {

  function startWeddingWebsite() {

    const header = document.querySelector(".newspaper");
    const navigation = document.querySelector(".paper-nav");
    const main = document.querySelector(".content");
    const footer = document.querySelector("footer");

    if (!header || !main) {
      console.error("Newspaper sections not found.");
      return;
    }

    // Create invitation
    const invitation = document.createElement("div");
    invitation.className = "invitation";

    // Create book
    const book = document.createElement("div");
    book.className = "book";

    const pages = [];

    // Create page
    function createPage(number) {

      const page = document.createElement("div");

      page.className = "paper-page";
      page.setAttribute("aria-label", "Page " + number);

      const content = document.createElement("div");
      content.className = "page-content";

      page.appendChild(content);
      book.appendChild(page);

      pages.push(page);

      return content;
    }

    // PAGE 1 - FRONT COVER
    const page1 = createPage(1);

    page1.appendChild(header);

    const frontFooter = document.createElement("div");
    frontFooter.className = "front-footer";
    frontFooter.textContent =
      "ANG PINAKAMAGANDANG ARAW SA LAHAT!";

    page1.appendChild(frontFooter);

    // PAGE 2 - LOVE STORY AND WEDDING DETAILS
    const page2 = createPage(2);

    ["story", "details"].forEach(function (id) {

      const section = document.getElementById(id);

      if (section) {
        page2.appendChild(section);
      }

    });

    // PAGE 3 - ENTOURAGE, DRESS CODE AND PROGRAM
    const page3 = createPage(3);

    ["entourage", "dresscode", "timeline"].forEach(function (id) {

      const section = document.getElementById(id);

      if (section) {
        page3.appendChild(section);
      }

    });

    // PAGE 4 - GALLERY AND RSVP
    const page4 = createPage(4);

    ["gallery", "rsvp"].forEach(function (id) {

      const section = document.getElementById(id);

      if (section) {
        page4.appendChild(section);
      }

    });

    // Add final message
    const finalMessage =
      document.querySelector(".final-message");

    if (finalMessage) {
      page4.appendChild(finalMessage);
    }

    // Add footer
    if (footer) {
      page4.appendChild(footer);
    }

    // Hide old navigation
    if (navigation) {
      navigation.hidden = true;
    }

    // Create controls
    const controls = document.createElement("div");
    controls.className = "page-controls";

    const previousButton = document.createElement("button");
    previousButton.type = "button";
    previousButton.id = "previousPage";
    previousButton.textContent = "❮ Nakaraan";

    const indicator = document.createElement("span");
    indicator.id = "pageIndicator";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.id = "nextPage";
    nextButton.textContent = "Susunod ❯";

    controls.appendChild(previousButton);
    controls.appendChild(indicator);
    controls.appendChild(nextButton);

    invitation.appendChild(book);
    invitation.appendChild(controls);

    document.body.insertBefore(
      invitation,
      document.body.firstChild
    );

    // Remove original main container
    main.remove();

    // CURRENT PAGE
    let currentPage = 0;

    // SHOW PAGE
    function showPage(pageNumber) {

      if (pageNumber < 0 || pageNumber >= pages.length) {
        return;
      }

      currentPage = pageNumber;

      pages.forEach(function (page, index) {

        page.classList.toggle(
          "active",
          index === currentPage
        );

        page.setAttribute(
          "aria-hidden",
          index === currentPage ? "false" : "true"
        );

      });

      // Update page indicator
      indicator.textContent =
        (currentPage + 1) + " / " + pages.length;

      // Update button states
      previousButton.disabled = currentPage === 0;

      nextButton.disabled =
        currentPage === pages.length - 1;

      // Save current page
      book.setAttribute(
        "data-current-page",
        currentPage + 1
      );

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }

    // ANDROID-FRIENDLY BUTTON HANDLERS

    previousButton.onclick = function (event) {

      event.preventDefault();

      if (currentPage > 0) {
        showPage(currentPage - 1);
      }

    };

    nextButton.onclick = function (event) {

      event.preventDefault();

      if (currentPage < pages.length - 1) {
        showPage(currentPage + 1);
      }

    };

    // Keyboard navigation
    document.onkeydown = function (event) {

      if (event.key === "ArrowRight") {
        showPage(currentPage + 1);
      }

      if (event.key === "ArrowLeft") {
        showPage(currentPage - 1);
      }

    };

    // Allow other scripts to navigate
    window.goToWeddingPage = function (pageNumber) {
      showPage(pageNumber - 1);
    };

    // Start on cover
    showPage(0);

    console.log("Wedding newspaper navigation ready!");

  }

  // Make sure HTML is ready
  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      startWeddingWebsite
    );

  } else {

    startWeddingWebsite();

  }

})();
