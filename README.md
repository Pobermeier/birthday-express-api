# Birthday Organizer - Express API + Vanilla JS Web App

Birthday Organizer is a simple front-end application build with Vanilla JS & Bootstrap components. It fetches it's data from an Node- & Express-based REST-API. Data storage on the server-side is implemented with an in-memory database that is written to a JSON-file once the server gracefully shuts down. A live version of the front-end app can be found [here](http://104.248.44.20:5003/)

## Project Set-Up

After cloning this repository install all depencies via NPM using the following CLI-command:

`npm install`

To run the dev server it is recommended to use Nodemon, so that the dev server automatically reboots when changes are made. Nodemon can be installed globally via:

`npm i -g nodemon`

## NPM Scripts

To run a dev server (uses Nodemon) that auto-reloads when changes are made use:

`npm run dev`

To run the server in "production" without Nodemon use instead the following script:

`npm start`

## Testing with Postman

The API can also be tested locally w/o the front-end using Postman. A ready-to-use Postman-collection can be found in the root folder of the project - "BirthdayAPI.postman_collection.json". This file can easily be imported into Postman to set-up the test environment.
