const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001; // Change the port number here

// Load timezones from JSON file
let timezones = []; // Initialize as an empty array
fs.readFile(path.join(__dirname, 'timezones_data.json'), 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading timezones_data.json:', err);
    } else {
        try {
            timezones = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing timezones_data.json:', parseErr);
        }
    }
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { time: null, error: null, timezones: timezones });
});

app.get('/search', (req, res) => {
    const timezone = req.query.timezone;

    if (!timezone) {
        return res.render('index', { time: null, error: 'Please select a timezone', timezones: timezones });
    }

    // Find the selected timezone object
    const selectedTimezone = timezones.find(tz => tz.value === timezone);
    if (!selectedTimezone) {
        return res.render('index', { time: null, error: 'Timezone not found', timezones: timezones });
    }

    const currentTime = new Date().toLocaleString('en-US', { timeZone: selectedTimezone.value });
    res.render('index', { time: currentTime, error: null, timezones: timezones });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
