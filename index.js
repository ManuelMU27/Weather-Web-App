// Weather App JavaScript: Handles UI interactions, API calls, and temperature conversions.
// Select DOM elements
const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const loading = document.querySelector('.loading');
const input = document.querySelector('.search-box input');
const temperature = document.querySelector('.temperature');
const unitToggle = document.querySelector('.unit-toggle');

// Variable to hold temperature unit (Celsius by default)
let isCelsius = true;
let celsiusTemp;

// Function to update the displayed temperature based on the current unit (Celsius or Farenheit)
function updateTemperature(){

    if(celsiusTemp !== undefined){

        // Updates temperature display based on the unit selected
        temperature.innerHTML = isCelsius 
            ? `${parseInt(celsiusTemp)}<span>°C</span>` // Celsius
            : `${parseInt((celsiusTemp * 9/5) + 32)}<span>°F</span>`; // Farenheit
    }
}

// Search button click event
search.addEventListener('click', () => {

    const APIKey = '158f720b1c38fae417cfd87f62c55c07';
    const city = document.querySelector('.search-box input').value; // Gets the city from input 
    if(city === '') // Doesn't proceed if input is empty
        return;
    loading.style.display = 'block'; // Shows loading indicator

    // Fetches weather data from the OpenWeather API
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`).then(response => response.json()).then(json => {

        celsiusTemp = json.main.temp; // Stores the temperature in Celsius
        updateTemperature(); // Displays the temperature with the current unit
        loading.style.display = 'none'; // Hides loading when data is received
        
        if(json.cod === '404'){

            // Handles case where city isn't found
            container.style.height = '500px';
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            error404.style.display = 'block';
            error404.classList.add('fadeIn');
            return;
        }

        // Displays weather details for a valid city
        error404.style.display = 'none';
        error404.classList.remove('fadeIn');

        const image = document.querySelector('.weather-box img');
        const description = document.querySelector('.weather-box .description');
        const humidity = document.querySelector('.weather-details .humidity span');
        const wind = document.querySelector('.weather-details .wind span');

        // Sets the weather icon based on the weather conditions
        switch(json.weather[0].main){
            case 'Clear':
                image.src = 'images/clear.png';
                break;

            case 'Rain':
                image.src = 'images/rain.png';
                break;

            case 'Snow':
                image.src = 'images/snow.png';
                break;

            case 'Clouds':
                image.src = 'images/clouds.png';
                break;

            case 'Haze':
                image.src = 'images/haze.png';
                break;

            default:
                image.src = '';
        }

        // Displays weather details
        description.innerHTML = `${json.weather[0].description}`;
        humidity.innerHTML = `${json.main.humidity}%`;
        wind.innerHTML = `${parseInt(json.wind.speed)}km/h`;

        // Shows weather box and details
        weatherBox.style.display = '';
        weatherDetails.style.display = '';
        weatherBox.classList.add('fadeIn');
        weatherDetails.classList.add('fadeIn');
        container.style.height = '690px';
    }).catch(error => {

        console.error('Error fetching weather data:', error);
        loading.style.display = 'none'; // Hide loading on error
    });
});

// Allows search by pressing 'Enter' key
input.addEventListener('keypress', (event) => {

    if(event.key === 'Enter'){
        search.click(); // Trigger search button click when 'Enter' is pressed
    }
});

// Unit toggle button click event
unitToggle.addEventListener('click', () => {

    if (celsiusTemp !== undefined){

        isCelsius = !isCelsius; // Toggle between Celsius and Farenheit
        updateTemperature(); // Update temperature display with new unit
    }
});
