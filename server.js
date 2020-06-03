// Node internal modules
const fs = require('fs');

// 3rd-Party Node-module deps
const express = require('express');
const bodyParser = require('body-parser');

// 1st-Party Project deps
const generateUUID = require('./generateUUID');

// Init express
const app = express();
const PORT = 5003;

// Express middleware
app.use(express.static('wwwroot'));
app.use(bodyParser.json());

// Load data from json-file & make data transformations on in-memory data while server is running
const data = JSON.parse(fs.readFileSync('data.json'));

// @route GET /birthday
// @desc Get all data - names + birthday
app.get('/birthday', (req, res) => {
  console.log('GET /birthday');
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(500).json({ msg: 'Internal Server Error (500)' });
  }
});

// @route POST /birthday
// @desc Add a new entry & Save name + birthday
app.post('/birthday', (req, res) => {
  console.log('POST /birthday');
  const newUserData = req.body;
  console.log(newUserData);

  if (!req.body.first_name || !req.body.last_name || !req.body.birthday) {
    res.status(400).json({ msg: 'Invalid data!' });
    return;
  }

  newUserData.id = generateUUID();
  data &&
    data.push({
      id: generateUUID(),
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      birthday: req.body.birthday,
    });

  res.status(200).json(data);
});

// @route DELETE /birthday/:id
// @desc Delete an entry
app.delete('/birthday/:id', (req, res) => {
  console.log('DELETE /birthday/:id');
  res.send('DELETE /birthday/:id');
});

// @route PUT /birthday
// @desc Edit & update an entry
app.put('/birthday/:id', (req, res) => {
  console.log('PUT /birthday/:id');
  res.send('PUT /birthday/:id');
});

app.listen(PORT, () => {
  console.log(`Server running and listening on PORT ${PORT}`);
});

// On process-exit (STRC-C * 2) write user data to JSON-file
process.on('SIGINT', () => {
  fs.writeFileSync('data.json', JSON.stringify(data));
});
