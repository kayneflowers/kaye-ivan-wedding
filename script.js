
/* =========================================
   KAYE & IVAN
   FOUR-PAGE DIGITAL NEWSPAPER
========================================= */

(function () {
  const header = document.querySelector(".newspaper");
  const navigation = document.querySelector(".paper-nav");
  const main = document.querySelector(".content");
  const footer = document.querySelector("footer");

  if (!header || !main) {
    console.error("Wedding invitation sections not found.");
    return;
  }

  // Create the invitation container
  const invitation = document.createElement("div");
  invitation.className = "invitation";

  // Create the newspaper book
  const book = document.createElement("div");
  book.className = "book";

  const pages = [];

  // Four-page content arrangement
  const pageSections = [
    [],

    ["story", "details"],

    ["entourage", "dresscode", "timeline"],

    ["gallery", "rsvp"]
  ];

  // Create each page
  function createPage(number) {
    const page = document.createElement("div");

    page.className = "paper-page";
    page.setAttribute("aria-label", "Newspaper page " + number);

    const content = document.createElement("div");
    content.className = "page-content";

    page.appendChild(content);
    book.appendChild(page);

    pages.push(page);

    return content;
  }

  // PAGE 1 - FRONT COVER
  const firstPage = createPage(1);

  firstPage.appendChild(header);

  const frontFooter = document.createElement("div");
  frontFooter.className = "front-footer";
  frontFooter.textContent =
    "ANG PINAKAMAGANDANG ARAW SA LAHAT!";

  firstPage.appendChild(frontFooter);

  // PAGES 2 TO 4
  pageSections.forEach(function (sectionIds, index) {

    if (index === 0) return;

    const pageContent = createPage(index + 1);

    sectionIds.forEach(function (id) {
      const section = document.getElementById(id);

      if (section) {
        pageContent.appendChild(section);
      }
    });

  });

  // Add final message and footer to PAGE 4
  const lastPage = pages[3].querySelector(".page-content");

  const finalMessage = document.querySelector(".final-message");

  if (finalMessage) {
    lastPage.appendChild(finalMessage);
  }

  if (footer) {
    lastPage.appendChild(footer);
  }

  // Hide the old section navigation
  if (navigation) {
    navigation.hidden = true;
  }

  // Place the book inside the invitation
  invitation.appendChild(book);

  // Create page controls
  const controls = document.createElement("div");
  controls.className = "page-controls";

  const previousButton = document.createElement("button");
  previousButton.id = "previousPage";
  previousButton.textContent = "← NAKARAAN";
  previousButton.type = "button";

  const indicator = document.createElement("span");
  indicator.id = "pageIndicator";

  const nextButton = document.createElement("button");
  nextButton.id = "nextPage";
  nextButton.textContent = "SUSUNOD →";
  nextButton.type = "button";

  controls.appendChild(previousButton);
  controls.appendChild(indicator);
  controls.appendChild(nextButton);

  invitation.appendChild(controls);

  // Insert the invitation into the website
  document.body.insertBefore(invitation, document.body.firstChild);

  // Remove the original empty main container
  main.remove();

  // Current page
  let currentPage = 0;

  // Change page
  function showPage(pageNumber) {

    if (pageNumber < 0 || pageNumber >= pages.length) {
      return;
    }

    currentPage = pageNumber;

    pages.forEach(function (page, index) {

      const isActive = index === currentPage;

      page.classList.toggle("active", isActive);

      page.setAttribute(
        "aria-hidden",
        isActive ? "false" : "true"
      );

    });

    // Update page number
    indicator.textContent =
      "PAHINA " + (currentPage + 1) +
      " / " + pages.length;

    // Disable buttons when needed
    previousButton.disabled = currentPage === 0;

    nextButton.disabled =
      currentPage === pages.length - 1;

    // Return to the top of the newspaper
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

  // Previous page
  previousButton.addEventListener("click", function () {
    showPage(currentPage - 1);
  });

  // Next page
  nextButton.addEventListener("click", function () {
    showPage(currentPage + 1);
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (event) {

    if (event.key === "ArrowRight") {
      showPage(currentPage + 1);
    }

    if (event.key === "ArrowLeft") {
      showPage(currentPage - 1);
    }

  });

  // Navigate to a page when a section is requested
  const sectionPage = {
    story: 2,
    details: 2,
    entourage: 3,
    dresscode: 3,
    timeline: 3,
    gallery: 4,
    rsvp: 4
  };

  // Make section navigation available to other scripts
  window.goToWeddingPage = function (pageNumber) {
    showPage(pageNumber - 1);
  };

  // Start on the front cover
  showPage(0);

})();
