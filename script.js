
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

/* =====================================
   PAGE 6 — INTERACTIVE WORD SEARCH
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  const grid = document.getElementById("interactiveWordGrid");
  const wordItems = document.querySelectorAll("#wordList li");
  const progress = document.getElementById("wordProgress");
  const message = document.getElementById("puzzleMessage");

  // Stop if the puzzle elements are not on the page
  if (!grid || !wordItems.length) return;

  const words = [
    "AEGIYA",
    "NOVEMBER",
    "ELEVEN",
    "DODAY",
    "BANTOT",
    "IVAN",
    "KAYE",
    "GITARA",
    "ROSAS",
    "FIESTA"
  ];

  const SIZE = 12;
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];

  let cells = [];
  let foundWords = new Set();
  let selectedCells = [];
  let startCell = null;
  let isSelecting = false;

  // Create a puzzle with all target words
  function createPuzzle() {
    const board = Array.from(
      { length: SIZE },
      () => Array(SIZE).fill("")
    );

    function canPlace(word, row, col, dr, dc) {
      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;

        if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) {
          return false;
        }

        if (board[r][c] !== "" && board[r][c] !== word[i]) {
          return false;
        }
      }

      return true;
    }

    function placeWord(word) {
      const options = [];

      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          directions.forEach(([dr, dc]) => {
            if (canPlace(word, r, c, dr, dc)) {
              options.push({ r, c, dr, dc });
            }
          });
        }
      }

      // Shuffle possible placements
      options.sort(() => Math.random() - 0.5);

      for (const option of options) {
        const { r, c, dr, dc } = option;

        for (let i = 0; i < word.length; i++) {
          board[r + dr * i][c + dc * i] = word[i];
        }

        return true;
      }

      return false;
    }

    // Try again if a placement cannot be completed
    function buildBoard() {
      for (let attempt = 0; attempt < 100; attempt++) {
        for (let r = 0; r < SIZE; r++) {
          board[r].fill("");
        }

        let successful = true;

        for (const word of words) {
          if (!placeWord(word)) {
            successful = false;
            break;
          }
        }

        if (successful) return true;
      }

      return false;
    }

    buildBoard();

    // Fill empty spaces with random letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (!board[r][c]) {
          board[r][c] =
            alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    return board;
  }

  // Display the puzzle
  function renderPuzzle() {
    const board = createPuzzle();

    grid.innerHTML = "";
    cells = [];

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const cell = document.createElement("button");

        cell.type = "button";
        cell.className = "puzzle-cell";
        cell.textContent = board[r][c];
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.setAttribute("aria-label", board[r][c]);

        grid.appendChild(cell);
        cells.push(cell);
      }
    }
  }

  function getCellFromPoint(x, y) {
    const element = document.elementFromPoint(x, y);
    return element ? element.closest(".puzzle-cell") : null;
  }

  function getSelectedCells(endCell) {
    if (!startCell || !endCell) return [];

    const startRow = Number(startCell.dataset.row);
    const startCol = Number(startCell.dataset.col);
    const endRow = Number(endCell.dataset.row);
    const endCol = Number(endCell.dataset.col);

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    if (
      rowDiff !== 0 &&
      colDiff !== 0 &&
      Math.abs(rowDiff) !== Math.abs(colDiff)
    ) {
      return [];
    }

    const rowStep = Math.sign(rowDiff);
    const colStep = Math.sign(colDiff);
    const length = Math.max(
      Math.abs(rowDiff),
      Math.abs(colDiff)
    ) + 1;

    const result = [];

    for (let i = 0; i < length; i++) {
      const r = startRow + rowStep * i;
      const c = startCol + colStep * i;

      const cell = grid.querySelector(
        `[data-row="${r}"][data-col="${c}"]`
      );

      if (cell) result.push(cell);
    }

    return result;
  }

  function clearPreview() {
    cells.forEach(cell => {
      cell.classList.remove("preview");
    });
  }

  function showPreview(selection) {
    clearPreview();

    selection.forEach(cell => {
      if (!cell.classList.contains("found")) {
        cell.classList.add("preview");
      }
    });
  }

  function updateProgress() {
    const count = foundWords.size;

    if (progress) {
      progress.textContent =
        count + " sa " + words.length + " salita ang nahanap";
    }

    if (count === words.length && message) {
      message.textContent =
        "🎉 Binabati namin kayo! Nahanap ninyo ang lahat ng salita!";
    }
  }

  function checkSelection(selection) {
    if (!selection.length) return;

    const selectedWord = selection
      .map(cell => cell.textContent)
      .join("");

    const reversedWord = selectedWord.split("").reverse().join("");

    const matchedWord = words.find(word =>
      word === selectedWord || word === reversedWord
    );

    if (!matchedWord || foundWords.has(matchedWord)) {
      if (message) {
        message.textContent = "Subukan muli! Hanapin ang susunod na salita.";
      }
      return;
    }

    foundWords.add(matchedWord);

    selection.forEach(cell => {
      cell.classList.remove("preview");
      cell.classList.add("found");
    });

    const matchingItem = document.querySelector(
      `#wordList li[data-word="${matchedWord}"]`
    );

    if (matchingItem) {
      matchingItem.classList.add("found-word");
    }

    if (message) {
      message.textContent = "✨ Nahanap ang " + matchedWord + "!";
    }

    updateProgress();
  }

  // Start selecting letters
  grid.addEventListener("pointerdown", function (event) {
    const cell = event.target.closest(".puzzle-cell");

    if (!cell) return;

    event.preventDefault();

    isSelecting = true;
    startCell = cell;
    selectedCells = [cell];

    showPreview(selectedCells);
  });

  // Drag across letters
  document.addEventListener("pointermove", function (event) {
    if (!isSelecting || !startCell) return;

    const cell = getCellFromPoint(event.clientX, event.clientY);

    if (!cell || !grid.contains(cell)) return;

    selectedCells = getSelectedCells(cell);
    showPreview(selectedCells);
  });

  // Finish selection
  document.addEventListener("pointerup", function () {
    if (!isSelecting) return;

    isSelecting = false;

    checkSelection(selectedCells);
    clearPreview();

    selectedCells = [];
    startCell = null;
  });

  // Reset selection if pointer is cancelled
  document.addEventListener("pointercancel", function () {
    isSelecting = false;
    clearPreview();
    selectedCells = [];
    startCell = null;
  });

  renderPuzzle();
  updateProgress();

});

/* =====================================
   BONUS QUESTION — LA VIE EN ROSE
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  const answerInput = document.getElementById("bonusAnswer");

  if (!answerInput) return;

  const bonusSection = answerInput.closest(".bonus-question");

  if (!bonusSection) return;

  // Create answer button
  const checkButton = document.createElement("button");
  checkButton.type = "button";
  checkButton.textContent = "SURIIN ANG SAGOT";
  checkButton.className = "bonus-check-button";

  // Create feedback message
  const feedback = document.createElement("p");
  feedback.className = "bonus-feedback";
  feedback.setAttribute("aria-live", "polite");

  answerInput.insertAdjacentElement("afterend", checkButton);
  checkButton.insertAdjacentElement("afterend", feedback);

  function checkBonusAnswer() {

    const answer = answerInput.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "");

    if (!answer) {
      feedback.textContent = "Ilagay muna ang inyong sagot. ❤️";
      feedback.className = "bonus-feedback incorrect";
      return;
    }

    if (answer === "lavieenrose") {

      feedback.textContent =
        "🌹 Tama! La Vie En Rose! Isang awiting may espesyal na lugar sa kuwento ng pag-ibig nina Kaye at Ivan. ❤️";

      feedback.className = "bonus-feedback correct";
      answerInput.disabled = true;
      checkButton.disabled = true;

    } else {

      feedback.textContent =
        "Hindi pa po iyan ang tamang sagot. Subukan muli! Hint: Isang awiting Pranses. 🌹";

      feedback.className = "bonus-feedback incorrect";

    }
  }

  checkButton.addEventListener("click", checkBonusAnswer);

  answerInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      checkBonusAnswer();
    }
  });

});

/* PAGE 11 — CLICK TO ENLARGE RESORT PHOTOS */

document.addEventListener("DOMContentLoaded", function () {
  const photos = document.querySelectorAll(
    "#page11 .resort-gallery img"
  );

  const lightbox = document.getElementById("imageLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("closeLightbox");

  if (!lightbox || !lightboxImage || !closeButton) return;

  photos.forEach(function (photo) {
    photo.addEventListener("click", function () {
      lightboxImage.src = photo.src;
      lightbox.classList.add("active");
    });
  });

  closeButton.addEventListener("click", function () {
    lightbox.classList.remove("active");
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      lightbox.classList.remove("active");
    }
  });
});


/* =====================================
   PAGE 11 — RESORT PHOTO CAROUSEL
   SUPPORTS 10 PHOTOS
===================================== */

document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("resortCarousel");

  if (!carousel) return;

  const slides = carousel.querySelectorAll(".resort-slide");
  const dots = carousel.querySelectorAll(".resort-dot");
  const prevButton = carousel.querySelector(".resort-arrow.prev");
  const nextButton = carousel.querySelector(".resort-arrow.next");

  if (!slides.length || !prevButton || !nextButton) return;

  let currentIndex = 0;
  let autoplay;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  function startAutoplay() {
    stopAutoplay();

    autoplay = setInterval(function () {
      showSlide(currentIndex + 1);
    }, 5000);
  }

  prevButton.addEventListener("click", function () {
    showSlide(currentIndex - 1);
    startAutoplay();
  });

  nextButton.addEventListener("click", function () {
    showSlide(currentIndex + 1);
    startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      showSlide(index);
      startAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  carousel.addEventListener("touchstart", stopAutoplay, { passive: true });
  carousel.addEventListener("touchend", startAutoplay, { passive: true });

  showSlide(0);
  startAutoplay();
});
