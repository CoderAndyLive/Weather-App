document.addEventListener('DOMContentLoaded', () => {
    const weatherContainer = document.getElementById('weather');

    function fetchWeatherData() {
        // Get user's location based on IP
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(location => {
                const { latitude, longitude, city } = location;

                // Fetch weather data for the user's location
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`)
                    .then(response => response.json())
                    .then(data => {
                        const currentWeather = data.current;
                        const hourlyWeather = data.hourly;

                        weatherContainer.innerHTML = ''; // Clear previous content
                        const currentWeatherHtml = `
                            <h2>Current Weather in ${city}</h2>
                            <p> Time: ${currentWeather.time}</p>
                            <p>Temperature: ${currentWeather.temperature_2m}°C</p>
                            <p>Wind Speed: ${currentWeather.wind_speed_10m} m/s</p>
                        `;

                        let hourlyWeatherHtml = '<h2>Hourly Weather</h2>';
                        hourlyWeatherHtml += '<ul>';
                        for (let i = 0; i < hourlyWeather.time.length; i++) {
                            hourlyWeatherHtml += `
                                <li>
                                    <p>Time: ${hourlyWeather.time[i]}</p>
                                    <p>Temperature: ${hourlyWeather.temperature_2m[i]}°C</p>
                                    <p>Wind Speed: ${hourlyWeather.wind_speed_10m[i]} m/s</p>
                                    <p>Humidity: ${hourlyWeather.relative_humidity_2m[i]}%</p>
                                </li>
                            `;
                        }
                        hourlyWeatherHtml += '</ul>';

                        weatherContainer.innerHTML = currentWeatherHtml + hourlyWeatherHtml;
                    })
                    .catch(error => {
                        weatherContainer.innerHTML = '<p>Failed to fetch weather data.</p>';
                        console.error('Error fetching weather data:', error);
                    });
            })
            .catch(error => {
                weatherContainer.innerHTML = '<p>Failed to fetch location data.</p>';
                console.error('Error fetching location data:', error);
            });
    }

    fetchWeatherData(); 
    setInterval(fetchWeatherData, 60000); 
});
