// Get the form elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track the selected team
let count = 0;
const maxCount = 50;
let attendees = [];
const teams = [
  { id: "water", name: "Team Water Wise" },
  { id: "zero", name: "Team Net Zero" },
  { id: "power", name: "Team Renewables" },
];
const storageKey = "checkInState";

function getTeamCount(teamId) {
  const teamCountElement = document.getElementById(teamId + "Count");
  return parseInt(teamCountElement.textContent, 10);
}

function setTeamCount(teamId, value) {
  const teamCountElement = document.getElementById(teamId + "Count");
  teamCountElement.textContent = value;
}

function updateAttendeeCount() {
  const attendeeCountSpan = document.getElementById("attendeeCount");
  attendeeCountSpan.textContent = count;
}

function updateProgressBar() {
  const progressBar = document.getElementById("progressBar");
  const progress = Math.round((count / maxCount) * 100) + "%";
  progressBar.style.width = progress;
}

function renderAttendeeList() {
  const attendeeList = document.getElementById("attendeeList");
  attendeeList.innerHTML = "";

  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.classList.add("attendee-item");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = attendee.name;

    const teamSpan = document.createElement("span");
    teamSpan.textContent = attendee.teamName;
    teamSpan.classList.add("attendee-team");

    listItem.appendChild(nameSpan);
    listItem.appendChild(teamSpan);
    attendeeList.appendChild(listItem);
  });

  const attendeeEmpty = document.getElementById("attendeeEmpty");
  if (attendees.length === 0) {
    attendeeEmpty.style.display = "block";
  } else {
    attendeeEmpty.style.display = "none";
  }
}

function addAttendee(name, teamId, teamName) {
  attendees.push({ name: name, teamId: teamId, teamName: teamName });
  renderAttendeeList();
}

function saveState() {
  const teamCounts = {};

  teams.forEach(function (team) {
    teamCounts[team.id] = getTeamCount(team.id);
  });

  const state = {
    count: count,
    teamCounts: teamCounts,
    attendees: attendees,
  };

  localStorage.setItem(storageKey, JSON.stringify(state));
}

function loadState() {
  const savedState = localStorage.getItem(storageKey);
  if (!savedState) {
    updateAttendeeCount();
    updateProgressBar();
    return;
  }

  let state = null;
  try {
    state = JSON.parse(savedState);
  } catch (error) {
    updateAttendeeCount();
    updateProgressBar();
    return;
  }

  if (typeof state.count === "number") {
    count = state.count;
  }

  if (state.teamCounts) {
    teams.forEach(function (team) {
      const savedCount = state.teamCounts[team.id];
      if (typeof savedCount === "number") {
        setTeamCount(team.id, savedCount);
      }
    });
  }

  if (Array.isArray(state.attendees)) {
    attendees = state.attendees;
  }

  updateAttendeeCount();
  updateProgressBar();
  updateCelebrationMessage();
  renderAttendeeList();
}

function highlightWinningTeams(winnerIds) {
  teams.forEach(function (team) {
    const teamCard = document.querySelector(".team-card." + team.id);
    teamCard.classList.remove("winner");

    if (winnerIds.includes(team.id)) {
      teamCard.classList.add("winner");
    }
  });
}

function updateCelebrationMessage() {
  if (count < maxCount) {
    return;
  }

  const celebrationElement = document.getElementById("celebration");
  const teamCounts = teams.map(function (team) {
    return { id: team.id, name: team.name, count: getTeamCount(team.id) };
  });
  const highestCount = Math.max(
    teamCounts[0].count,
    teamCounts[1].count,
    teamCounts[2].count,
  );
  const winningTeams = teamCounts.filter(function (team) {
    return team.count === highestCount;
  });
  const winningIds = winningTeams.map(function (team) {
    return team.id;
  });
  const winningNames = winningTeams.map(function (team) {
    return team.name;
  });

  highlightWinningTeams(winningIds);

  let celebrationMessage = "";
  if (winningNames.length === 1) {
    celebrationMessage = `🎉 Attendance goal reached! ${winningNames[0]} wins!`;
  } else {
    celebrationMessage = `🎉 Attendance goal reached! It's a tie between ${winningNames.join(", ")}.`;
  }

  celebrationElement.textContent = celebrationMessage;
  celebrationElement.style.display = "block";
}

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
  updateAttendeeCount();

  // Update progress bar width
  updateProgressBar();

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent, 10) + 1;

  // Show welcome message
  const message = `Welcome, ${name}! Thanks for joining the Summit.`;
  const greetingElement = document.getElementById("greeting");
  greetingElement.textContent = message;
  greetingElement.classList.add("success-message");
  greetingElement.style.display = "block";

  addAttendee(name, team, teamName);

  updateCelebrationMessage();
  saveState();
});

loadState();
