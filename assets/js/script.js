// DEPENDENCIES
const APIKey = "08b122fe9ed8e9ecded5fa9f8251dfc6";
const searchButton = document.getElementById("search");
const searchForm = document.getElementById("search");
const cardSection = document.getElementById("card-section");

// DATA

// FUNCTIONS
// Grab the data from the form
function start(event) {
  event.preventDefault();

  const formData = new FormData(searchForm);
  const cityName = formData.get("city");

  getWeather(cityName);
}

const weatherFiveDay = [];

// turn the city name into usable data for the api
function getWeather(cityName) {
  const geoCodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIKey}`;

  fetch(geoCodeUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    // grab the weather forcast using the lat and lon we extracted from the city name
    .then(function (geoData) {
      const lat = geoData[0].lat;
      const lon = geoData[0].lon;
      const cityName = geoData[0].name;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;

      return fetch(weatherUrl);
    })
    .then(function (weatherResponse) {
      if (!weatherResponse.ok) {
        throw new Error("Weather data request failed");
      }
      return weatherResponse.json();
    })
    // filter out the info we need from the api response
    .then(function (weatherData) {
      const weatherDataHolder = [];
      weatherDataHolder.push(
        weatherData.list[3],
        weatherData.list[11],
        weatherData.list[19],
        weatherData.list[27],
        weatherData.list[35]
      );
      // send the data to an array for future use
      weatherFiveDay.push(weatherDataHolder);

      for (let i = 0; i < weatherFiveDay[0].length; i++) {
        const dayIcon = weatherFiveDay[0][i].weather[0].icon;
        const dayTemp = "Temp: " + weatherFiveDay[0][i].main.temp_max + "°F";
        const dayWind = "Wind: " + weatherFiveDay[0][i].wind.speed + "MPH";
        const dayHumidity =
          "Humidty: " + weatherFiveDay[0][i].main.humidity + "%";
        appendCard(dayIcon, dayTemp, dayWind, dayHumidity);

        console.log(weatherFiveDay);
      } //
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
  console.log(weatherFiveDay);
  // make the weather cards

  function appendCard(weatherIcon, temp, windSpeed, humidity) {
    // Create card elements
    const card = document.createElement("div");
    card.className = "card bg-secondary mb-3";
    card.style.maxWidth = "18rem";

    const cardIcon = document.createElement("div");
    cardIcon.className = "card-header d-flex justify-content-center";

    const iconImg = document.createElement("img");
    iconImg.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${weatherIcon}.png`
    );

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardTemp = document.createElement("p");
    cardTemp.className = "card-text text-light text-center";
    cardTemp.textContent = temp;

    const cardWind = document.createElement("p");
    cardWind.className = "card-text text-light text-center";
    cardWind.textContent = windSpeed;

    const cardHumidity = document.createElement("p");
    cardHumidity.className = "card-text text-light text-center";
    cardHumidity.textContent = humidity;

    // Append card elements
    cardBody.appendChild(cardTemp);
    cardBody.appendChild(cardWind);
    cardBody.appendChild(cardHumidity);

    cardIcon.appendChild(iconImg);
    card.appendChild(cardIcon);
    card.appendChild(cardBody);

    // Append the card to the card section
    cardSection.appendChild(card);
  }
}

// USER INTERACTIONS
searchButton.addEventListener("submit", start);
