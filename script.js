// Get the form elements
const form = document.getElementById("CheckInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track the selected team
let count = 0;
const maxCount = 50;

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  //Get the form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);
  // increament count
  count++;
  console.log("Total check-ins: ", count);

  // Update attendee count span
  const attendeeCountSpan = document.getElementById("attendeeCount");
  attendeeCountSpan.textContent = count;

  //update progress bar
  const progress = Math.round((count / maxCount) * 100) + "%";
  console.log("Progress: ${percentage}");

  // Update progress bar width
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = progress;

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Show welcome message
  const message = `👋 Welcome, ${name} from ${teamName}`;
  const greetingElement = document.getElementById("greeting");
  greetingElement.textContent = message;

  form.requestFullscreen();
});
