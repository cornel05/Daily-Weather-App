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