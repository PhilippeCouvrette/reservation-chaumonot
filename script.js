// Remplace ces deux valeurs par les tiennes une fois la feuille créée
const SHEET_ID = "1CVjKzyqHetHLWG1sjk0ii22R-N5H-ICPkp6azBTSopU";
const API_KEY = "AIzaSyC2GaNP1g03AoPvDqauEiBTLCN8geqN9zw";

const SHEET_NAME = "Réservations";

document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: fetchEvents,
  });
  calendar.render();

  document.getElementById("booking-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const chalet = document.getElementById("chalet").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A1:D1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

    const body = {
      values: [[name, chalet, startDate, endDate]]
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        document.getElementById("form-message").textContent = "Réservation ajoutée!";
        calendar.refetchEvents();
      } else {
        document.getElementById("form-message").textContent = "Erreur d'envoi.";
      }
    } catch (err) {
      document.getElementById("form-message").textContent = "Erreur : " + err;
    }
  });
});

function fetchEvents(fetchInfo, successCallback, failureCallback) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const rows = data.values.slice(1);
      const events = rows.map(row => ({
        title: `Chalet ${row[1]} - ${row[0]}`,
        start: row[2],
        end: row[3]
      }));
      successCallback(events);
    })
    .catch(error => {
      console.error("Erreur de chargement des réservations :", error);
      failureCallback(error);
    });
}

function logout() {
  window.location.href = "index.html";
}
