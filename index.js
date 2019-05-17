const express = require('express');
const bodyParser = require('body-parser');

var apisIntermediator    = require('./routes/apisIntermediator');

const app = express();
app.use(bodyParser.json());

//routes that i need
app.use('/*', apisIntermediator);

// middleware for treatment of 404 requisitions
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

//Server listening
app.listen(80,function () {
  console.log('Server started on portaaa 80...');
});