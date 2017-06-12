const express = require('express'),
    mongoose = require('mongoose'),
    body__parser = require('body-parser'),
    app = express();

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://test:test@ds121192.mlab.com:21192/oilman__test');

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

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
});