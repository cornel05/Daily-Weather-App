const forecastContainer = document.getElementById("weather-forecast");

// Function to remove a forecast card
function removeForecast(index) {
  const card = document.querySelector(`.forecast-card[data-index="${index}"]`);
  if (card) {
    card.classList.add("fade-out"); // Add fade-out animation
    setTimeout(() => {
      card.remove(); // Remove the card after animation ends
    }, 500);
  }
}

// // Function to dynamically add a forecast
// document.getElementById("add-city").addEventListener("click", () => {
//   const cityInput = document.getElementById("city-input");
//   const cityName = cityInput.value.trim();
//   if (cityName) {
//     const newCard = document.createElement("div");
//     newCard.className = "forecast-card animate-card";
//     newCard.dataset.index = Date.now(); // Use a timestamp as a unique index
//     newCard.innerHTML = `
//             <button class="remove-btn" onclick="removeForecast(${newCard.dataset.index})">x</button>
//             <h2>${cityName}</h2>
//             <p class="temperature">--°</p>
//             <p class="icon">❓</p>
//             <div class="details">
//                 <p>Feels like: --°</p>
//                 <p>Wind: -- km/h</p>
//                 <p>Humidity: --%</p>
//             </div>
//         `;
//     forecastContainer.appendChild(newCard);
//     cityInput.value = ""; // Clear input
//   }
// });
