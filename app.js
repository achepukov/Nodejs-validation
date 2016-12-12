var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'))
app.use(bodyParser());

app.get('/', function(request, response) {
    response.send('public/index.html');
})

app.post('/', function (request, response) {
  request.body.a;
  response.send('');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})