const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const PORT = 3000;

// Predefined timezones
const timezones = [
    { name: 'New York', value: 'America/New_York' },
    { name: 'Los Angeles', value: 'America/Los_Angeles' },
    { name: 'London', value: 'Europe/London' },
    { name: 'Tokyo', value: 'Asia/Tokyo' },
    { name: 'Sydney', value: 'Australia/Sydney' },
    { name: 'Mumbai', value: 'Asia/Kolkata' },
    { name: 'Berlin', value: 'Europe/Berlin' },
    { name: 'Paris', value: 'Europe/Paris' },
    { name: 'Moscow', value: 'Europe/Moscow' },
    { name: 'Dubai', value: 'Asia/Dubai' }
];

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { time: null, error: null, timezones: timezones });
});

app.get('/search', async (req, res) => {
    const timezone = req.query.timezone;

    if (!timezone) {
        return res.render('index', { time: null, error: 'Please select a timezone', timezones: timezones });
    }

    try {
        const response = await axios.get(`http://worldtimeapi.org/api/timezone/${timezone}`);
        const dateTime = response.data.datetime;
        const date = new Date(dateTime);
        const formattedTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        res.render('index', { time: formattedTime, error: null, timezones: timezones });
    } catch (error) {
        res.render('index', { time: null, error: 'Could not fetch time for the selected timezone', timezones: timezones });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
