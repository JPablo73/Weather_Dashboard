// Open Weather Map API key
var apiKey = "8e77e6e1fa25a9dfa13462054e78c23e";

// Function or retrieve weather for city searched
function searchCity(event) {
  event.preventDefault();

  var cityInput = $("#searchcity").val();

  if (cityInput === "") {
    return;
  }

  searchCurrentWeather(cityInput);

  populateSearchHistory(cityInput);

  $("#searchcity").val("");
}

// function to fetch current weather of city from current weather data api on openweathermap.
function searchCurrentWeather(city) {
  // "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}"
  var searchQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  // Seach Current Weather
  $.ajax({
    url: searchQueryURL,
    method: "GET",
  }).then(function (response) {
    // Log the queryURL
    console.log("Search Query URL : " + searchQueryURL);

    // Convert the temp to fahrenheit
    var tempF = (response.main.temp - 273.15) * 1.8 + 32;

    // Convert Kelvin to celsius : 0K − 273.15 = -273.1°C
    var tempC = response.main.temp - 273.15;

    var currentDate = new Date().toLocaleDateString();

    var latitude = response.coord.lat;
    var longitude = response.coord.lon;

    //address of uv api url
    var uvQueryURL =
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&appid=" +
      apiKey;

    var cityId = response.id;

    // "https://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&cnt=5&units=imperial&appid="+apiKey;
    var forecastQueryURL =
      "https://api.openweathermap.org/data/2.5/forecast?id=" +
      cityId +
      "&units=imperial&appid=" +
      apiKey;

    $("#city-card").show();

    $("#temperature").text(
      "Temperature : " + tempF.toFixed(2) + " °F/ " + tempC.toFixed(2) + "°C"
    ); //SHIFT OPTION 8 for degree symbol
    $("#humidity").text("Humidity : " + response.main.humidity + " %");
    $("#windspeed").text("Wind Speed : " + response.wind.speed + " MPH");

    var imageIcon = $("<img>").attr(
      "src",
      "https://openweathermap.org/img/wn/" +
        response.weather[0].icon.toString() +
        ".png"
    );

    $("#city-name")
      .text(response.name + " (" + currentDate + ") ")
      .append(imageIcon);

    getUVIndex(uvQueryURL);

    showForecast(forecastQueryURL);
  });
}
