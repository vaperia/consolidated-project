import os
import requests
import re
from dotenv import load_dotenv

load_dotenv()
WEATHER_KEY = os.getenv('WEATHER_key')

# Getting weather data from the weather API
def get_weather(city):
    url = 'http://api.weatherstack.com/current'
    params = {'access_key': WEATHER_KEY, 'query': city}
    response = requests.get(url, params=params)
    weather_data = response.json()

    if 'error' in weather_data:
        return "Sorry, I couldn't find the weather information for that location."

    location = weather_data['location']['name']
    temperature = weather_data['current']['temperature']
    description = weather_data['current']['weather_descriptions'][0]
    
    return f"The current weather in {location} is {description} with a temperature of {temperature}°C."

# Uses a regular expression to extract a city name from user input
def extract_city(user_input):
    # Look for phrases like "weather in [city]" or "weather [city]"
    city_match = re.search(r'weather (in\s)?([A-Za-z\s]+)', user_input)
    if city_match:
        city = city_match.group(2).strip()
        return city
    return None