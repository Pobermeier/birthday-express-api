const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const generateUUID = require('./generateUUID');

const app = express();
const PORT = 5003;

const data = JSON.parse(fs.readFileSync('data.json'));

app.use(express.static('wwwroot'));
app.use(bodyParser.json());

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

process.on('SIGINT', () => {
  fs.writeFileSync('data.json', JSON.stringify(data));
});
