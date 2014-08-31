var express = require('express')
var app = express();
app.use(express.static('./dist'));
var server = app.listen(8080, function () {
	console.log('Waiting for request on port %d', server.address().port);
});
