const express = require('express'),
    mongoose = require('mongoose'),
    body__parser = require('body-parser'),
    app = express();

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://test:test@ds121192.mlab.com:21192/oilman__test');

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(body__parser.json());
app.use(body__parser.urlencoded({
    extended: true
}));

// ROUTING
app.use('/users', require('./modules/users'));
// END ROUTING

app.get('*', function(req, res){
    res.json('GET OUT!');
});

app.listen(8080, () => {
    console.log('OILMAN started on a port 8080!')
});