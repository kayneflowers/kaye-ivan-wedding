
// GOOGLE SHEETS CONNECTION
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE";

// RSVP FORM
const rsvpForm = document.getElementById("rsvpForm");

rsvpForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  const submitButton = document.getElementById("submitButton");
  const message = document.getElementById("rsvpMessage");

  const guestName = document.getElementById("guestName").value.trim();
  const attendance = document.getElementById("attendance").value;
  const guestCount = document.getElementById("guestCount").value;
  const guestMessage = document.getElementById("message").value.trim();

  if (!guestName || !attendance || !guestCount) {
    message.textContent = "Pakikumpleto ang mga kinakailangang detalye.";
    return;
  }

  if (GOOGLE_SCRIPT_URL === "PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE") {
    message.textContent =
      "Hindi pa nakakonekta ang RSVP sa Google Sheets.";
    return;
  }

  const formData = new URLSearchParams({
    guestName: guestName,
    attendance: attendance,
    guestCount: guestCount,
    message: guestMessage
  });

  submitButton.disabled = true;
  submitButton.textContent = "IPINADADALA...";

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    message.textContent =
      "Maraming salamat! Ipinadala na ang inyong RSVP.";

    rsvpForm.reset();

  } catch (error) {
    message.textContent =
      "Hindi naipadala ang inyong RSVP. Pakisubukang muli.";
    console.error(error);

  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "IPADALA ANG RSVP";
  }
});
