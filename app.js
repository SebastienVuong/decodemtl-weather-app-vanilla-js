(function() {
    var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
    var DARKSKY_API_KEY = '6f79e5f22ba33f3f5c674b0b9f80fdc4';
    var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
    
    var GOOGLE_MAPS_API_KEY = 'AIzaSyBMHBRMpdVXHnpHrNuM8Ryeq7tu5zjrjm8';
    var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-90,180),
      new google.maps.LatLng(90,180));
    
    var input = document.getElementById('city');
    var options = {
      bounds: defaultBounds,
      types: ['(cities)']
    };
    
    autocomplete = new google.maps.places.Autocomplete(input, options);

    // This function returns a promise that will resolve with an object of lat/lng coordinates
    function getCoordinatesForCity(cityName) {
        // This is an ES6 template string, much better than verbose string concatenation...
        var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;
        
        return (
            fetch(url) // Returns a promise for a Response
            .then(response => response.json()) // Returns a promise for the parsed JSON
            .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
        );
    }
    // Testing line
   // getCoordinatesForCity("toronto").then(console.log);
    
    function getNameForCity(cityName) {
        // This is an ES6 template string, much better than verbose string concatenation...
        var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;
        
        return (
            fetch(url) // Returns a promise for a Response
            .then(response => response.json()) // Returns a promise for the parsed JSON
            .then(data => data.results[0].formatted_address) // Transform the response to only take what we need
        );
    }
    // Testing line
    // getCoordinatesForCity("toronto").then(console.log);
    
    function getCurrentWeather(coords) {
        // Template string again! I hope you can see how nicer this is :)
        var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;
        
        return (
            fetch(url)
            .then(response => response.json())
            .then(data => data.currently)
        );
    }
    // Testing line
    // getCurrentWeather({lat: 45.5, lng: -73.5}).then(console.log)
    
    function getDailyData(coords) {
        // Template string again! I hope you can see how nicer this is :)
        var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=currently,minutely,hourly,alerts,flags`;
        
        return (
            fetch(url)
            .then(response => response.json())
            .then(data => data.daily.data)
        );
    }
    // Testing line
    // getDailyData({lat: 45.5, lng: -73.5}).then(console.log)
    
    function getSrcForIcon(weather) {
        switch (weather) {
            case 'clear-day':
                return 'http://i.imgur.com/lHG4WX9.png'
            case 'clear-night':
                return 'http://i.imgur.com/gnu9EH6.png'
            case 'rain':
                return 'http://i.imgur.com/gBGnNZB.png'
            case 'snow':
                return 'http://i.imgur.com/rsuUxrc.png'
            case 'sleet':
                return 'http://i.imgur.com/IEiZrND.png'
            case 'wind':
                return 'http://i.imgur.com/0mGaBD9.png'
            case 'fog':
                return 'http://i.imgur.com/pzVEmPi.png'
            case 'cloudy':
                return 'http://i.imgur.com/WAhlz31.png'
            case 'partly-cloudy-day':
                return 'http://i.imgur.com/FjRVZbp.png'
            case 'partly-cloudy-night':
                return 'http://i.imgur.com/mRXBVbs.png'
            default:
                return 'http://i.imgur.com/YMaxYVX.png'
        }
    }

    var app = document.querySelector('#app');
    var cityForm = app.querySelector('.city-form');
    var cityInput = cityForm.querySelector('.city-input');
    var getWeatherButton = cityForm.querySelector('.get-weather-button');
    var cityWeather = app.querySelector('.city-weather');
    var windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    
    cityForm.addEventListener('submit', function(event) { // this line changes
        event.preventDefault(); // prevent the form from submitting
    // This code doesn't change!
        cityWeather.innerHTML ="";
        var city = cityInput.value;
    // Print location
        var locationTitle = document.createElement('p');
        locationTitle.setAttribute('class', 'section-title');
        locationTitle.innerText = "Loading...";
        cityWeather.appendChild(locationTitle);
    // Generate current weather
        var currentWeather = document.createElement('div');
        cityWeather.appendChild(currentWeather);
        currentWeather.setAttribute('class', 'currentWeather');
        getNameForCity(city)
        .then(location => {
            locationTitle.innerText = location;
            currentWeather.innerHTML= "Loading...";
            getCoordinatesForCity(city)
            .then(getCurrentWeather)
            .then(weather => {
                currentWeather.innerHTML = "";
            // Generate weather and temperature
                var weatherTemp = document.createElement('div');
                weatherTemp.setAttribute('class', 'weather-temp');
                currentWeather.appendChild(weatherTemp);
            // Generate weather div
                var weatherIcon = document.createElement('div');
                weatherIcon.setAttribute('class', 'weather-icon');
                weatherTemp.appendChild(weatherIcon);
            // Generate img for icon
                var newImage = document.createElement('img');
                newImage.setAttribute('class', 'icon');
                newImage.setAttribute('alt', weather.icon)
                weatherIcon.appendChild(newImage);
            // Generate temp div
                var currentTemp = document.createElement('div');
                currentTemp.setAttribute('class', 'temp-div');
                weatherTemp.appendChild(currentTemp);
            // Generate current temperature
                var actualTemp = document.createElement('p');
                actualTemp.setAttribute('class', 'actual-temp');
                currentTemp.appendChild(actualTemp);
            // Generate apparent temprature
                var apparentTemp = document.createElement('p');
                apparentTemp.setAttribute('class', 'apparent-temp');
                currentTemp.appendChild(apparentTemp);
            // Generate wind speed
                var windSection = document.createElement('div');
                windSection.setAttribute('class', 'current-wind')
                var wind = document.createElement('p');
                wind.setAttribute('class', 'wind');
                currentWeather.appendChild(windSection);
                windSection.appendChild(wind);
                
            // FILLING IN THE DATA
                
            // Icon for the weather
                newImage.setAttribute('src', getSrcForIcon(weather.icon));
                // Actual temperature
                actualTemp.innerText = Math.round(weather.temperature);
                actualTemp.innerText += " °C";
            // Apparent temperature
                apparentTemp.innerHTML = "<span class='id'>Feels like </span>" + "<br>";
                apparentTemp.innerHTML += Math.round(weather.apparentTemperature);
                apparentTemp.innerHTML += " °C";
            // Wind speed
                wind.innerHTML = "<span class='id'>Wind:</span>";
                wind.innerHTML += "<span class='value'>";
                wind.innerHTML += Math.round(weather.windSpeed);
                wind.innerHTML += " km/h ( "
            // Wind direction
                wind.innerHTML += windDirections[Math.floor((weather.windBearing + 22.5)/45)];
                wind.innerHTML += " ) </span>"
                
                var forecastTitle = document.createElement('p');
                forecastTitle.setAttribute('class', 'section-title');
                forecastTitle.innerText = "5-Day Forecast";
                cityWeather.appendChild(forecastTitle);
                
            // Generating forecast and set to "Loading..."
                var forecast = document.createElement('div');
                forecast.setAttribute('class', 'forecast')
                cityWeather.appendChild(forecast);
                forecast.innerHTML = "Loading...";
                
                // function getDailyData
                getCoordinatesForCity(city)
                .then(getDailyData)
                .then(dailyData => {
                // Get today's date and label the next 5 days
                    forecast.innerHTML ="";
                    var today = (new Date()).getDay();
                    var days = ["Today", "Tomorrow", weekdays[(today+2)%7], weekdays[(today+3)%7], weekdays[(today+4)%7]];
                // Generate a forecast div for each day
                    for (var i = 0; i < 5; i++) {
                    // Create div for 1 day
                        var oneDayForecast = document.createElement('div');
                        forecast.appendChild(oneDayForecast);
                        oneDayForecast.setAttribute('class', 'daily-forecast');// col-small-6 col-medium-4 col-large-2');
                        
                    // Create p for title
                        var title = document.createElement('p')
                        title.setAttribute('class', 'forecast-day');
                        oneDayForecast.appendChild(title);
                    // Create div for icon
                        var weather = document.createElement('div')
                        weather.setAttribute('class', 'icon');
                        oneDayForecast.appendChild(weather);
                    // Create image for weather
                        var newImage = document.createElement('img');
                        newImage.setAttribute('class', 'icon');
                        newImage.setAttribute('alt', dailyData[i].icon)
                        weather.appendChild(newImage);
                    // Create p for max temp
                        var maxTemp = document.createElement('p')
                        maxTemp.setAttribute('class', 'id');
                        oneDayForecast.appendChild(maxTemp);
                    // Create p for min temp
                        var minTemp = document.createElement('p')
                        minTemp.setAttribute('class', 'id');
                        oneDayForecast.appendChild(minTemp);
                    // Create p for wind
                        var wind = document.createElement('p')
                        wind.setAttribute('class', 'id');
                        oneDayForecast.appendChild(wind);
                        
                    // FILLING IN THE DATA
                    
                    // Day
                        title.innerHTML = days[i];
                    // Weather icon
                        newImage.setAttribute('src', getSrcForIcon(dailyData[i].icon));
                    // Max temp
                        maxTemp.innerHTML = "Max: <span class='value'>" + Math.round(dailyData[i].temperatureMax) + " °C </span>";
                    // Min temp
                        minTemp.innerHTML = "Min: <span class='value'>" + Math.round(dailyData[i].temperatureMin) + " °C </span>";
                    // Wind 
                        wind.innerHTML = "Wind: <span class='value'>" + Math.round(dailyData[i].windSpeed) + " km/h ( " + windDirections[Math.floor((dailyData[i].windBearing + 22.5)/45)] + " ) </span>";
                    }
                })
            })
            
        });
        // .then( Generate forecast and display data, must create getForecast function. )
    });
})();



