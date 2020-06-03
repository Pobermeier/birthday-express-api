const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5003;

app.use(express.static('wwwroot'));

// @route GET /birthday
// @desc Get all data - names + birthday

// @route POST /birthday
// @desc Add a new entry & Save name + birthday

// @route DELETE /birthday/:id
// @desc Delete an entry

// @route PUT /birthday
// @desc Edit & update an entry

app.listen(PORT, () => {
  console.log(`Server running and listening on PORT ${PORT}`);
});
